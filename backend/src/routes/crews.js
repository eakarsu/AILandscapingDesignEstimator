const express = require('express');
const CrewSchedule = require('../models/CrewSchedule');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await CrewSchedule.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const crew = await CrewSchedule.findByPk(req.params.id);
    if (!crew) return res.status(404).json({ error: 'Crew schedule not found' });
    res.json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/ai-analysis', auth, async (req, res) => {
  try {
    const crew = await CrewSchedule.findByPk(req.params.id, {
      attributes: ['id', 'title', 'status', 'aiScheduleOptimization', 'aiAnalysis', 'updatedAt'],
    });
    if (!crew) return res.status(404).json({ error: 'Crew schedule not found' });
    if (!crew.aiAnalysis && !crew.aiScheduleOptimization) {
      return res.status(404).json({ error: 'No AI analysis available. Run POST /:id/optimize first.' });
    }
    res.json({
      crewId: crew.id,
      title: crew.title,
      status: crew.status,
      structured: crew.aiAnalysis || null,
      rawText: crew.aiScheduleOptimization || null,
      generatedAt: crew.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const crew = await CrewSchedule.create(req.body);
    res.status(201).json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const crew = await CrewSchedule.findByPk(req.params.id);
    if (!crew) return res.status(404).json({ error: 'Crew schedule not found' });
    await crew.update(req.body);
    res.json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const crew = await CrewSchedule.findByPk(req.params.id);
    if (!crew) return res.status(404).json({ error: 'Crew schedule not found' });
    await crew.destroy();
    res.json({ message: 'Crew schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/optimize', auth, aiRateLimiter, async (req, res) => {
  try {
    const crew = await CrewSchedule.findByPk(req.params.id);
    if (!crew) return res.status(404).json({ error: 'Crew schedule not found' });

    const systemPrompt = 'You are an expert crew scheduling manager for landscaping businesses. Respond with valid JSON containing: taskSequence (array of {task, duration, assignedTo}), timeAllocation (object), crewRoles (array), travelEfficiency (object with route and savings), breakSchedule (array), weatherContingency (object), productivityScore (number 0-100), and recommendations (array). No markdown fences.';
    const userPrompt = `Optimize the following crew schedule:
- Crew Leader: ${crew.crewLeader}
- Crew Size: ${crew.crewSize}
- Project: ${crew.projectName}
- Date: ${crew.assignedDate}
- Start: ${crew.startTime} - End: ${crew.endTime}
- Tasks: ${crew.taskDescription}
- Skills Required: ${crew.skillsRequired}`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);

    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({
        error: result.error,
        fallback: result.fallback || false,
      });
    }

    const updateData = { aiScheduleOptimization: result.data };
    if (result.structured) updateData.aiAnalysis = result.structured;
    await crew.update(updateData);
    res.json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

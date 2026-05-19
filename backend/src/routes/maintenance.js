const express = require('express');
const MaintenanceSchedule = require('../models/MaintenanceSchedule');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await MaintenanceSchedule.findAndCountAll({
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
    const schedule = await MaintenanceSchedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/ai-analysis', auth, async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findByPk(req.params.id, {
      attributes: ['id', 'title', 'status', 'aiRecommendation', 'aiAnalysis', 'updatedAt'],
    });
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    if (!schedule.aiAnalysis && !schedule.aiRecommendation) {
      return res.status(404).json({ error: 'No AI analysis available. Run POST /:id/generate first.' });
    }
    res.json({
      scheduleId: schedule.id,
      title: schedule.title,
      status: schedule.status,
      structured: schedule.aiAnalysis || null,
      rawText: schedule.aiRecommendation || null,
      generatedAt: schedule.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.create(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    await schedule.update(req.body);
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    await schedule.destroy();
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/generate', auth, aiRateLimiter, async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

    const systemPrompt = 'You are an expert landscaping maintenance specialist. Respond with valid JSON containing: maintenanceTasks (array of {task, timing, toolsNeeded, estimatedTime, priority}), seasonalCalendar (object with months as keys and tasks as arrays), bestPractices (array), warningSignsToWatch (array), estimatedAnnualCost (number), and nextServiceDate (string). No markdown fences.';
    const userPrompt = `Generate a detailed maintenance recommendation for:
- Property: ${schedule.propertyName}
- Season: ${schedule.season}
- Task Type: ${schedule.taskType}
- Frequency: ${schedule.frequency}
- Priority: ${schedule.priority}
- Notes: ${schedule.notes}`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);

    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({
        error: result.error,
        fallback: result.fallback || false,
      });
    }

    const updateData = { aiRecommendation: result.data, status: 'scheduled' };
    if (result.structured) updateData.aiAnalysis = result.structured;
    await schedule.update(updateData);
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

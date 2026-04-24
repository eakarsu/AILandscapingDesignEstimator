const express = require('express');
const CrewSchedule = require('../models/CrewSchedule');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const crews = await CrewSchedule.findAll({ order: [['createdAt', 'DESC']] });
    res.json(crews);
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

router.post('/:id/optimize', auth, async (req, res) => {
  try {
    const crew = await CrewSchedule.findByPk(req.params.id);
    if (!crew) return res.status(404).json({ error: 'Crew schedule not found' });

    const systemPrompt = 'You are an expert crew scheduling manager for landscaping businesses. Provide detailed, professional schedule optimization recommendations with efficiency improvements, resource allocation strategies, and productivity metrics. Format your response with clear sections using headers.';
    const userPrompt = `Optimize the following crew schedule:
- Crew Name: ${crew.crewName}
- Crew Size: ${crew.crewSize}
- Scheduled Date: ${crew.scheduledDate}
- Start Time: ${crew.startTime}
- End Time: ${crew.endTime}
- Job Type: ${crew.jobType}
- Location: ${crew.location}
- Priority: ${crew.priority}
- Notes: ${crew.notes}

Provide a comprehensive schedule optimization including: optimal task sequencing, time allocation per task, crew member role assignments, travel route efficiency, break scheduling, weather contingency plans, and productivity improvement suggestions.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await crew.update({ aiScheduleOptimization: aiResponse });
    res.json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

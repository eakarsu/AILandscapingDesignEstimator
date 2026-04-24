const express = require('express');
const MaintenanceSchedule = require('../models/MaintenanceSchedule');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const schedules = await MaintenanceSchedule.findAll({ order: [['createdAt', 'DESC']] });
    res.json(schedules);
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

router.post('/:id/generate', auth, async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

    const systemPrompt = 'You are an expert landscaping maintenance specialist. Provide detailed seasonal maintenance schedules with specific tasks, timing, and best practices. Format your response with clear sections.';
    const userPrompt = `Generate a detailed maintenance recommendation for:
- Property: ${schedule.propertyName}
- Season: ${schedule.season}
- Task Type: ${schedule.taskType}
- Frequency: ${schedule.frequency}
- Priority: ${schedule.priority}
- Notes: ${schedule.notes}

Provide specific maintenance tasks, timing recommendations, tools needed, and best practices for this season.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await schedule.update({ aiRecommendation: aiResponse, status: 'scheduled' });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

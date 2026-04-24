const express = require('express');
const TimeEntry = require('../models/TimeEntry');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const entries = await TimeEntry.findAll({ order: [['date', 'DESC']] });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/summary', auth, async (req, res) => {
  try {
    const entries = await TimeEntry.findAll();
    const totalHours = entries.reduce((sum, e) => sum + (e.hoursWorked || 0), 0);
    const totalCost = entries.reduce((sum, e) => sum + ((e.hoursWorked || 0) * (e.hourlyRate || 0)), 0);
    const byWorker = {};
    const byProject = {};
    entries.forEach(e => {
      byWorker[e.workerName] = (byWorker[e.workerName] || 0) + (e.hoursWorked || 0);
      byProject[e.projectName] = (byProject[e.projectName] || 0) + (e.hoursWorked || 0);
    });
    res.json({ totalHours, totalCost, byWorker, byProject, count: entries.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await TimeEntry.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Time entry not found' });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.startTime && data.endTime) {
      const [sh, sm] = data.startTime.split(':').map(Number);
      const [eh, em] = data.endTime.split(':').map(Number);
      const totalMinutes = (eh * 60 + em) - (sh * 60 + sm) - (data.breakMinutes || 0);
      data.hoursWorked = Math.round((totalMinutes / 60) * 100) / 100;
    }
    const entry = await TimeEntry.create(data);
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const entry = await TimeEntry.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Time entry not found' });
    const data = { ...req.body };
    if (data.startTime && data.endTime) {
      const [sh, sm] = data.startTime.split(':').map(Number);
      const [eh, em] = data.endTime.split(':').map(Number);
      const totalMinutes = (eh * 60 + em) - (sh * 60 + sm) - (data.breakMinutes || 0);
      data.hoursWorked = Math.round((totalMinutes / 60) * 100) / 100;
    }
    await entry.update(data);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await TimeEntry.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Time entry not found' });
    await entry.destroy();
    res.json({ message: 'Time entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

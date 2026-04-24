const express = require('express');
const Project = require('../models/Project');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    await project.update(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/timeline', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const systemPrompt = 'You are an expert landscaping project manager. Generate detailed project timelines with phases, milestones, resource allocation, and risk mitigation strategies. Format with clear sections.';
    const userPrompt = `Generate a project timeline for:
- Project: ${project.title}
- Client: ${project.clientName}
- Address: ${project.address}
- Type: ${project.projectType}
- Start Date: ${project.startDate}
- End Date: ${project.endDate}
- Budget: $${project.budget}
- Current Progress: ${project.progress}%
- Notes: ${project.notes}

Provide a detailed timeline with: project phases and milestones, resource allocation per phase, critical path analysis, weather contingency plans, and quality checkpoints.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await project.update({ aiTimeline: aiResponse });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const PhotoGallery = require('../models/PhotoGallery');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const photos = await PhotoGallery.findAll({ order: [['createdAt', 'DESC']] });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const photo = await PhotoGallery.findByPk(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const photo = await PhotoGallery.create(req.body);
    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const photo = await PhotoGallery.findByPk(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    await photo.update(req.body);
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await PhotoGallery.findByPk(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    await photo.destroy();
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/analyze', auth, async (req, res) => {
  try {
    const photo = await PhotoGallery.findByPk(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    const systemPrompt = 'You are an expert landscape photo analyst specializing in landscaping design assessment. Provide detailed, professional analysis of landscape photos including plant identification, design evaluation, improvement recommendations, and aesthetic scoring. Format your response with clear sections using headers.';
    const userPrompt = `Analyze the following landscape photo entry:
- Title: ${photo.title}
- Description: ${photo.description}
- Category: ${photo.category}
- Location: ${photo.location}
- Season: ${photo.season}
- Tags: ${photo.tags}
- Project Type: ${photo.projectType}
- Notes: ${photo.notes}

Provide a comprehensive analysis including: landscape design assessment, plant health observations, aesthetic evaluation, improvement recommendations, seasonal maintenance suggestions, and potential design enhancements.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await photo.update({ aiAnalysis: aiResponse });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const Design = require('../models/Design');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const designs = await Design.findAll({ order: [['createdAt', 'DESC']] });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findByPk(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const design = await Design.create(req.body);
    res.status(201).json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findByPk(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    await design.update(req.body);
    res.json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findByPk(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    await design.destroy();
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/generate', auth, async (req, res) => {
  try {
    const design = await Design.findByPk(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });

    const systemPrompt = 'You are an expert landscape architect and designer. Provide detailed, professional landscaping design recommendations with specific plant selections, hardscaping elements, layout descriptions, and estimated costs. Format your response with clear sections using headers.';
    const userPrompt = `Generate a detailed landscaping design for:
- Property Type: ${design.propertyType}
- Square Footage: ${design.squareFootage} sq ft
- Style: ${design.style}
- Budget: $${design.budget}
- Description: ${design.description}
- Desired Features: ${design.features}

Provide a comprehensive design plan including: plant selections with quantities, hardscaping elements, layout recommendations, color scheme, seasonal interest considerations, and a budget breakdown.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await design.update({ aiDesign: aiResponse, status: 'generated' });
    res.json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

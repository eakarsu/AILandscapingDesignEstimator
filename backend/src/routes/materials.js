const express = require('express');
const MaterialEstimate = require('../models/MaterialEstimate');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const materials = await MaterialEstimate.findAll({ order: [['createdAt', 'DESC']] });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const material = await MaterialEstimate.findByPk(req.params.id);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const material = await MaterialEstimate.create(req.body);
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const material = await MaterialEstimate.findByPk(req.params.id);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    await material.update(req.body);
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const material = await MaterialEstimate.findByPk(req.params.id);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    await material.destroy();
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/estimate', auth, async (req, res) => {
  try {
    const material = await MaterialEstimate.findByPk(req.params.id);
    if (!material) return res.status(404).json({ error: 'Material not found' });

    const systemPrompt = 'You are an expert landscaping materials estimator. Provide detailed material quantity estimates, cost breakdowns, supplier recommendations, and waste factor calculations. Format your response with clear sections.';
    const userPrompt = `Estimate materials for:
- Project Type: ${material.projectType}
- Area: ${material.area} sq ft
- Material Type: ${material.materialType}
- Current Quantity Estimate: ${material.quantity} ${material.unit}
- Unit Price: $${material.unitPrice}
- Supplier: ${material.supplier}

Provide detailed quantity calculations with waste factors, alternative material options with pros/cons, cost optimization tips, and installation recommendations.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await material.update({ aiEstimate: aiResponse, status: 'ai-estimated' });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

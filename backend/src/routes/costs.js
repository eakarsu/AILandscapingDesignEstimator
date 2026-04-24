const express = require('express');
const CostEstimate = require('../models/CostEstimate');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const costs = await CostEstimate.findAll({ order: [['createdAt', 'DESC']] });
    res.json(costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const cost = await CostEstimate.findByPk(req.params.id);
    if (!cost) return res.status(404).json({ error: 'Cost estimate not found' });
    res.json(cost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const cost = await CostEstimate.create(req.body);
    res.status(201).json(cost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const cost = await CostEstimate.findByPk(req.params.id);
    if (!cost) return res.status(404).json({ error: 'Cost estimate not found' });
    await cost.update(req.body);
    res.json(cost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const cost = await CostEstimate.findByPk(req.params.id);
    if (!cost) return res.status(404).json({ error: 'Cost estimate not found' });
    await cost.destroy();
    res.json({ message: 'Cost estimate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/analyze', auth, async (req, res) => {
  try {
    const cost = await CostEstimate.findByPk(req.params.id);
    if (!cost) return res.status(404).json({ error: 'Cost estimate not found' });

    const systemPrompt = 'You are an expert landscaping cost estimator and business analyst. Provide detailed cost breakdowns, profit margin analysis, competitive pricing recommendations, and value engineering suggestions. Format with clear sections.';
    const userPrompt = `Analyze the cost estimate for:
- Project Type: ${cost.projectType}
- Labor Cost: $${cost.laborCost}
- Material Cost: $${cost.materialCost}
- Equipment Cost: $${cost.equipmentCost}
- Overhead: ${cost.overheadPercent}%
- Profit Margin: ${cost.profitMarginPercent}%
- Total Estimate: $${cost.totalEstimate}
- Client: ${cost.clientName}

Provide a detailed analysis including: cost breakdown per category, comparison with industry averages, profit optimization suggestions, value engineering options, risk factors, and recommended pricing strategy.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await cost.update({ aiBreakdown: aiResponse, status: 'analyzed' });
    res.json(cost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

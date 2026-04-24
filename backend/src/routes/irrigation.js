const express = require('express');
const IrrigationPlan = require('../models/IrrigationPlan');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const plans = await IrrigationPlan.findAll({ order: [['createdAt', 'DESC']] });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const plan = await IrrigationPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const plan = await IrrigationPlan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await IrrigationPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    await plan.update(req.body);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const plan = await IrrigationPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    await plan.destroy();
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/optimize', auth, async (req, res) => {
  try {
    const plan = await IrrigationPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const systemPrompt = 'You are an expert irrigation and water management specialist. Provide detailed irrigation optimization plans with zone-by-zone recommendations, water savings calculations, and smart scheduling. Format your response with clear sections.';
    const userPrompt = `Optimize the irrigation plan for:
- Property: ${plan.propertyName}
- Zones: ${plan.zoneCount}
- Water Source: ${plan.waterSource}
- Soil Type: ${plan.soilType}
- Area: ${plan.squareFootage} sq ft
- Current Usage: ${plan.currentUsageGallons} gallons/month
- Target Savings: ${plan.targetSavingsPercent}%

Provide zone-by-zone irrigation schedules, recommended sprinkler types, water savings projections, and smart controller settings.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await plan.update({ aiOptimization: aiResponse, status: 'optimized' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const IrrigationPlan = require('../models/IrrigationPlan');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await IrrigationPlan.findAndCountAll({
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
    const plan = await IrrigationPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/ai-analysis', auth, async (req, res) => {
  try {
    const plan = await IrrigationPlan.findByPk(req.params.id, {
      attributes: ['id', 'title', 'status', 'aiOptimization', 'aiAnalysis', 'updatedAt'],
    });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    if (!plan.aiAnalysis && !plan.aiOptimization) {
      return res.status(404).json({ error: 'No AI analysis available. Run POST /:id/optimize first.' });
    }
    res.json({
      planId: plan.id,
      title: plan.title,
      status: plan.status,
      structured: plan.aiAnalysis || null,
      rawText: plan.aiOptimization || null,
      generatedAt: plan.updatedAt,
    });
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

router.post('/:id/optimize', auth, aiRateLimiter, async (req, res) => {
  try {
    const plan = await IrrigationPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const systemPrompt = 'You are an expert irrigation and water management specialist. Respond with valid JSON containing: zoneSchedules (array of {zone, frequency, duration, sprinklerType, optimalTime}), waterSavingsProjection (object with gallonsPerMonth and percentage), smartControllerSettings (object), seasonalAdjustments (array), totalMonthlySavings (number), and recommendations (array). No markdown fences.';
    const userPrompt = `Optimize the irrigation plan for:
- Property: ${plan.propertyName}
- Zones: ${plan.zoneCount}
- Water Source: ${plan.waterSource}
- Soil Type: ${plan.soilType}
- Area: ${plan.squareFootage} sq ft
- Current Usage: ${plan.currentUsageGallons} gallons/month
- Target Savings: ${plan.targetSavingsPercent}%`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);

    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({
        error: result.error,
        fallback: result.fallback || false,
      });
    }

    const updateData = { aiOptimization: result.data, status: 'optimized' };
    if (result.structured) updateData.aiAnalysis = result.structured;
    await plan.update(updateData);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

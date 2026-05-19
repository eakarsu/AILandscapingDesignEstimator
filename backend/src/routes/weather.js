const express = require('express');
const WeatherPlan = require('../models/WeatherPlan');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await WeatherPlan.findAndCountAll({
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
    const plan = await WeatherPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Weather plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/ai-analysis', auth, async (req, res) => {
  try {
    const plan = await WeatherPlan.findByPk(req.params.id, {
      attributes: ['id', 'title', 'status', 'aiWeatherPlan', 'aiAnalysis', 'updatedAt'],
    });
    if (!plan) return res.status(404).json({ error: 'Weather plan not found' });
    if (!plan.aiAnalysis && !plan.aiWeatherPlan) {
      return res.status(404).json({ error: 'No AI analysis available. Run POST /:id/plan first.' });
    }
    res.json({
      planId: plan.id,
      title: plan.title,
      status: plan.status,
      structured: plan.aiAnalysis || null,
      rawText: plan.aiWeatherPlan || null,
      generatedAt: plan.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const plan = await WeatherPlan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await WeatherPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Weather plan not found' });
    await plan.update(req.body);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const plan = await WeatherPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Weather plan not found' });
    await plan.destroy();
    res.json({ message: 'Weather plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/plan', auth, aiRateLimiter, async (req, res) => {
  try {
    const plan = await WeatherPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Weather plan not found' });

    const systemPrompt = 'You are an expert meteorologist and landscaping climate specialist. Respond with valid JSON containing: seasonalPreparation (array of {task, timing, priority}), plantProtectionStrategies (array of {plant, strategy, threshold}), weatherResilientPlants (array of {name, reason, hardiness}), irrigationAdjustments (object with seasons as keys), frostProtection (object with measures and timeline), emergencyResponsePlan (array of steps), riskLevel (string), and expectedChallenges (array). No markdown fences.';
    const userPrompt = `Generate a weather-adapted landscaping plan for:
- Region: ${plan.region}
- Season: ${plan.season}
- Avg Temperature: ${plan.avgTemperature}°F
- Avg Rainfall: ${plan.avgRainfall} inches/month
- Frost Risk: ${plan.frostRisk}
- Wind Exposure: ${plan.windExposure}
- Current Recommendations: ${plan.recommendations}`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);

    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({
        error: result.error,
        fallback: result.fallback || false,
      });
    }

    const updateData = { aiWeatherPlan: result.data };
    if (result.structured) updateData.aiAnalysis = result.structured;
    await plan.update(updateData);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

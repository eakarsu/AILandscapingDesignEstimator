const express = require('express');
const WeatherPlan = require('../models/WeatherPlan');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const plans = await WeatherPlan.findAll({ order: [['createdAt', 'DESC']] });
    res.json(plans);
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

router.post('/:id/plan', auth, async (req, res) => {
  try {
    const plan = await WeatherPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Weather plan not found' });

    const systemPrompt = 'You are an expert meteorologist and landscaping climate specialist. Provide detailed weather-adapted landscaping plans with plant protection strategies, seasonal preparation guides, and climate-resilient design recommendations. Format with clear sections.';
    const userPrompt = `Generate a weather-adapted landscaping plan for:
- Region: ${plan.region}
- Season: ${plan.season}
- Avg Temperature: ${plan.avgTemperature}°F
- Avg Rainfall: ${plan.avgRainfall} inches/month
- Frost Risk: ${plan.frostRisk}
- Wind Exposure: ${plan.windExposure}
- Current Recommendations: ${plan.recommendations}

Provide a comprehensive weather plan including: seasonal preparation checklist, plant protection strategies, weather-resilient plant recommendations, irrigation adjustments, frost protection measures, and emergency weather response plan.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await plan.update({ aiWeatherPlan: aiResponse });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

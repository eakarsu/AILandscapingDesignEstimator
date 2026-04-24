const express = require('express');
const Plant = require('../models/Plant');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const plants = await Plant.findAll({ order: [['createdAt', 'DESC']] });
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const plant = await Plant.findByPk(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const plant = await Plant.create(req.body);
    res.status(201).json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const plant = await Plant.findByPk(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    await plant.update(req.body);
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const plant = await Plant.findByPk(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    await plant.destroy();
    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/care-guide', auth, async (req, res) => {
  try {
    const plant = await Plant.findByPk(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });

    const systemPrompt = 'You are an expert horticulturist and plant care specialist. Provide comprehensive, detailed plant care guides with specific watering schedules, fertilization plans, pruning instructions, and pest management advice. Format with clear sections.';
    const userPrompt = `Generate a detailed care guide for:
- Plant: ${plant.name} (${plant.scientificName})
- Category: ${plant.category}
- Sun Requirement: ${plant.sunRequirement}
- Water Needs: ${plant.waterNeeds}
- Hardiness Zone: ${plant.hardinessZone}
- Mature Height: ${plant.matureHeight}
- Bloom Season: ${plant.bloomSeason}

Provide a comprehensive care guide including: optimal growing conditions, watering schedule, fertilization plan, pruning guide, pest and disease management, companion planting suggestions, and seasonal care tips.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await plant.update({ aiCareGuide: aiResponse });
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

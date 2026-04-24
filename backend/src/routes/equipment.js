const express = require('express');
const Equipment = require('../models/Equipment');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const equipment = await Equipment.findAll({ order: [['createdAt', 'DESC']] });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    await equipment.update(req.body);
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    await equipment.destroy();
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/maintenance-plan', auth, async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    const systemPrompt = 'You are an expert equipment maintenance specialist for landscaping businesses. Provide detailed, professional maintenance plans with schedules, recommended parts, cost estimates, and preventive care guidelines. Format your response with clear sections using headers.';
    const userPrompt = `Generate a detailed maintenance plan for:
- Equipment Name: ${equipment.name}
- Equipment Type: ${equipment.type}
- Brand/Model: ${equipment.brand} ${equipment.model}
- Purchase Date: ${equipment.purchaseDate}
- Condition: ${equipment.condition}
- Hours Used: ${equipment.hoursUsed}
- Last Service Date: ${equipment.lastServiceDate}
- Notes: ${equipment.notes}

Provide a comprehensive maintenance plan including: scheduled maintenance intervals, recommended replacement parts, estimated maintenance costs, preventive care tips, expected lifespan projections, and safety inspection checklist.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await equipment.update({ aiMaintenancePlan: aiResponse });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

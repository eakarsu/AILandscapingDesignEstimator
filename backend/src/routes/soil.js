const express = require('express');
const SoilAnalysis = require('../models/SoilAnalysis');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const analyses = await SoilAnalysis.findAll({ order: [['createdAt', 'DESC']] });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await SoilAnalysis.findByPk(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const analysis = await SoilAnalysis.create(req.body);
    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const analysis = await SoilAnalysis.findByPk(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    await analysis.update(req.body);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const analysis = await SoilAnalysis.findByPk(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    await analysis.destroy();
    res.json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/analyze', auth, async (req, res) => {
  try {
    const analysis = await SoilAnalysis.findByPk(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });

    const systemPrompt = 'You are an expert soil scientist and agronomist. Provide detailed soil analysis interpretations, amendment recommendations, and planting guidelines based on soil test results. Format with clear sections.';
    const userPrompt = `Analyze the soil test results for:
- Location: ${analysis.location}
- Soil Type: ${analysis.soilType}
- pH Level: ${analysis.phLevel}
- Nitrogen: ${analysis.nitrogenLevel}
- Phosphorus: ${analysis.phosphorusLevel}
- Potassium: ${analysis.potassiumLevel}
- Organic Matter: ${analysis.organicMatter}
- Drainage: ${analysis.drainageRating}

Provide a detailed analysis including: soil health assessment, amendment recommendations with quantities, suitable plant recommendations, fertilization schedule, drainage improvements if needed, and long-term soil improvement plan.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await analysis.update({ aiAnalysis: aiResponse, status: 'analyzed' });
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

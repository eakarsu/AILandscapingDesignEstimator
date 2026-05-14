const express = require('express');
const SoilAnalysis = require('../models/SoilAnalysis');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await SoilAnalysis.findAndCountAll({
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
    const analysis = await SoilAnalysis.findByPk(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/ai-analysis', auth, async (req, res) => {
  try {
    const analysis = await SoilAnalysis.findByPk(req.params.id, {
      attributes: ['id', 'title', 'status', 'aiAnalysis', 'aiAnalysisJson', 'updatedAt'],
    });
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    if (!analysis.aiAnalysisJson && !analysis.aiAnalysis) {
      return res.status(404).json({ error: 'No AI analysis available. Run POST /:id/analyze first.' });
    }
    res.json({
      analysisId: analysis.id,
      title: analysis.title,
      status: analysis.status,
      structured: analysis.aiAnalysisJson || null,
      rawText: analysis.aiAnalysis || null,
      generatedAt: analysis.updatedAt,
    });
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

router.post('/:id/analyze', auth, aiRateLimiter, async (req, res) => {
  try {
    const analysis = await SoilAnalysis.findByPk(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });

    const systemPrompt = 'You are an expert soil scientist and agronomist. Respond with valid JSON containing: healthAssessment (object with score 0-100 and summary), amendments (array of {amendment, quantity, timing}), suitablePlants (array of {name, suitabilityScore, notes}), fertilizationSchedule (array of {month, product, rate}), drainageImprovements (array), longTermPlan (array of steps), and overallRating (string). No markdown fences.';
    const userPrompt = `Analyze the soil test results for:
- Location: ${analysis.location}
- Soil Type: ${analysis.soilType}
- pH Level: ${analysis.phLevel}
- Nitrogen: ${analysis.nitrogenLevel}
- Phosphorus: ${analysis.phosphorusLevel}
- Potassium: ${analysis.potassiumLevel}
- Organic Matter: ${analysis.organicMatter}
- Drainage: ${analysis.drainageRating}`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);

    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({
        error: result.error,
        fallback: result.fallback || false,
      });
    }

    const updateData = { aiAnalysis: result.data, status: 'analyzed' };
    if (result.structured) updateData.aiAnalysisJson = result.structured;
    await analysis.update(updateData);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

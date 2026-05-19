const express = require('express');
const CostEstimate = require('../models/CostEstimate');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { validateCostEstimateCreate, validateBody } = require('../middleware/validate');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await CostEstimate.findAndCountAll({
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
    const cost = await CostEstimate.findByPk(req.params.id);
    if (!cost) return res.status(404).json({ error: 'Cost estimate not found' });
    res.json(cost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET structured AI analysis for a cost estimate
router.get('/:id/ai-analysis', auth, async (req, res) => {
  try {
    const cost = await CostEstimate.findByPk(req.params.id, {
      attributes: ['id', 'title', 'status', 'aiBreakdown', 'aiAnalysis', 'updatedAt'],
    });
    if (!cost) return res.status(404).json({ error: 'Cost estimate not found' });
    if (!cost.aiAnalysis && !cost.aiBreakdown) {
      return res.status(404).json({
        error: 'No AI analysis available. Run POST /:id/analyze first.',
      });
    }
    res.json({
      estimateId: cost.id,
      title: cost.title,
      status: cost.status,
      structured: cost.aiAnalysis || null,
      rawText: cost.aiBreakdown || null,
      generatedAt: cost.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, validateBody(validateCostEstimateCreate), async (req, res) => {
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

router.post('/:id/analyze', auth, aiRateLimiter, async (req, res) => {
  try {
    const cost = await CostEstimate.findByPk(req.params.id);
    if (!cost) return res.status(404).json({ error: 'Cost estimate not found' });

    const systemPrompt = 'You are an expert landscaping cost estimator and business analyst. Respond with valid JSON containing: costBreakdown (object with categories), industryComparison (object with percentages vs averages), profitOptimization (array of suggestions), valueEngineering (array of options with savings), riskFactors (array), pricingStrategy (string), recommendedPrice (number), and confidence (number 0-1). No markdown fences.';
    const userPrompt = `Analyze the cost estimate for:
- Project Type: ${cost.projectType}
- Labor Cost: $${cost.laborCost}
- Material Cost: $${cost.materialCost}
- Equipment Cost: $${cost.equipmentCost}
- Overhead: ${cost.overheadPercent}%
- Profit Margin: ${cost.profitMarginPercent}%
- Total Estimate: $${cost.totalEstimate}
- Client: ${cost.clientName}`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);

    if (!result.success) {
      const statusCode = result.fallback ? 503 : 502;
      return res.status(statusCode).json({
        error: result.error,
        fallback: result.fallback || false,
        message: result.fallback
          ? 'AI service is not configured. Please set OPENROUTER_API_KEY.'
          : 'AI service returned an error. Please try again.',
      });
    }

    const updateData = {
      aiBreakdown: result.data,
      status: 'analyzed',
    };
    if (result.structured) {
      updateData.aiAnalysis = result.structured;
    }

    await cost.update(updateData);
    res.json(cost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

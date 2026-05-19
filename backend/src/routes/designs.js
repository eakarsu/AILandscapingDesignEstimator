const express = require('express');
const Design = require('../models/Design');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { validateDesignCreate, validateBody } = require('../middleware/validate');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await Design.findAndCountAll({
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
    const design = await Design.findByPk(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET structured AI analysis for a design
router.get('/:id/ai-analysis', auth, async (req, res) => {
  try {
    const design = await Design.findByPk(req.params.id, {
      attributes: ['id', 'title', 'status', 'aiDesign', 'aiAnalysis', 'updatedAt'],
    });
    if (!design) return res.status(404).json({ error: 'Design not found' });
    if (!design.aiAnalysis && !design.aiDesign) {
      return res.status(404).json({
        error: 'No AI analysis available. Run POST /:id/generate first.',
      });
    }
    res.json({
      designId: design.id,
      title: design.title,
      status: design.status,
      structured: design.aiAnalysis || null,
      rawText: design.aiDesign || null,
      generatedAt: design.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, validateBody(validateDesignCreate), async (req, res) => {
  try {
    const design = await Design.create(req.body);
    res.status(201).json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findByPk(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    await design.update(req.body);
    res.json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findByPk(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    await design.destroy();
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/generate', auth, aiRateLimiter, async (req, res) => {
  try {
    const design = await Design.findByPk(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });

    const systemPrompt = 'You are an expert landscape architect and designer. Provide detailed, professional landscaping design recommendations. Respond with valid JSON containing: summary (string), plantSelections (array of {name, quantity, purpose}), hardscaping (array of elements), layoutRecommendations (array), colorScheme (object with primary/accent/seasonal), seasonalInterest (array), budgetBreakdown (object with categories and amounts), estimatedTotalCost (number), and maintenanceNotes (array).';
    const userPrompt = `Generate a detailed landscaping design for:
- Property Type: ${design.propertyType}
- Square Footage: ${design.squareFootage} sq ft
- Style: ${design.style}
- Budget: $${design.budget}
- Description: ${design.description}
- Desired Features: ${design.features}

Return valid JSON only, no markdown fences.`;

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
      aiDesign: result.data,
      status: 'generated',
    };
    if (result.structured) {
      updateData.aiAnalysis = result.structured;
    }

    await design.update(updateData);
    res.json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

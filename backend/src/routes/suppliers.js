const express = require('express');
const Supplier = require('../models/Supplier');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await Supplier.findAndCountAll({
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
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/ai-analysis', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id, {
      attributes: ['id', 'name', 'status', 'aiSupplierAnalysis', 'aiAnalysis', 'updatedAt'],
    });
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    if (!supplier.aiAnalysis && !supplier.aiSupplierAnalysis) {
      return res.status(404).json({ error: 'No AI analysis available. Run POST /:id/analyze first.' });
    }
    res.json({
      supplierId: supplier.id,
      name: supplier.name,
      status: supplier.status,
      structured: supplier.aiAnalysis || null,
      rawText: supplier.aiSupplierAnalysis || null,
      generatedAt: supplier.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    await supplier.update(req.body);
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    await supplier.destroy();
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/analyze', auth, aiRateLimiter, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

    const systemPrompt = 'You are an expert procurement and supplier management specialist for landscaping businesses. Respond with valid JSON containing: reliabilityScore (number 0-100), pricingAssessment (object with rating and notes), deliveryPerformance (object with rating and notes), qualityConsistency (object with rating and notes), riskAssessment (object with level and factors), alternativeSuppliers (array of suggestions), negotiationStrategies (array), overallRecommendation (string), and shouldContinue (boolean). No markdown fences.';
    const userPrompt = `Analyze the following supplier:
- Name: ${supplier.name}
- Contact: ${supplier.contactPerson}
- Specialty: ${supplier.specialty}
- Rating: ${supplier.rating}
- Delivery Time: ${supplier.deliveryTime}
- Payment Terms: ${supplier.paymentTerms}
- Notes: ${supplier.notes}`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);

    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({
        error: result.error,
        fallback: result.fallback || false,
      });
    }

    const updateData = { aiSupplierAnalysis: result.data };
    if (result.structured) updateData.aiAnalysis = result.structured;
    await supplier.update(updateData);
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

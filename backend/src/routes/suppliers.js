const express = require('express');
const Supplier = require('../models/Supplier');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({ order: [['createdAt', 'DESC']] });
    res.json(suppliers);
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

router.post('/:id/analyze', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

    const systemPrompt = 'You are an expert procurement and supplier management specialist for landscaping businesses. Provide detailed, professional supplier analysis with reliability assessments, cost comparisons, and strategic sourcing recommendations. Format your response with clear sections using headers.';
    const userPrompt = `Analyze the following supplier:
- Company Name: ${supplier.companyName}
- Contact Name: ${supplier.contactName}
- Category: ${supplier.category}
- Products/Services: ${supplier.productsServices}
- Pricing Tier: ${supplier.pricingTier}
- Lead Time: ${supplier.leadTime}
- Rating: ${supplier.rating}
- Location: ${supplier.location}
- Payment Terms: ${supplier.paymentTerms}
- Notes: ${supplier.notes}

Provide a comprehensive supplier analysis including: reliability assessment, pricing competitiveness evaluation, delivery performance analysis, quality consistency review, risk assessment, alternative supplier recommendations, and strategies for negotiating better terms.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await supplier.update({ aiSupplierAnalysis: aiResponse });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

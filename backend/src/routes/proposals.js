const express = require('express');
const ClientProposal = require('../models/ClientProposal');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await ClientProposal.findAndCountAll({
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
    const proposal = await ClientProposal.findByPk(req.params.id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/ai-analysis', auth, async (req, res) => {
  try {
    const proposal = await ClientProposal.findByPk(req.params.id, {
      attributes: ['id', 'title', 'status', 'aiProposal', 'aiAnalysis', 'updatedAt'],
    });
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    if (!proposal.aiAnalysis && !proposal.aiProposal) {
      return res.status(404).json({ error: 'No AI analysis available. Run POST /:id/generate first.' });
    }
    res.json({
      proposalId: proposal.id,
      title: proposal.title,
      status: proposal.status,
      structured: proposal.aiAnalysis || null,
      rawText: proposal.aiProposal || null,
      generatedAt: proposal.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (!req.body.title || req.body.title.trim().length === 0) {
      return res.status(422).json({ error: 'title is required' });
    }
    const proposal = await ClientProposal.create(req.body);
    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const proposal = await ClientProposal.findByPk(req.params.id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    await proposal.update(req.body);
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const proposal = await ClientProposal.findByPk(req.params.id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    await proposal.destroy();
    res.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/generate', auth, aiRateLimiter, async (req, res) => {
  try {
    const proposal = await ClientProposal.findByPk(req.params.id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const systemPrompt = 'You are an expert landscaping business consultant. Respond with valid JSON containing: executiveSummary (string), scopeOfWork (array of items), materialsAndPlants (array of {item, quantity, estimatedCost}), projectPhases (array of {phase, description, duration, cost}), pricingBreakdown (object), warrantyTerms (string), maintenanceTerms (string), termsAndConditions (string), totalValue (number), and validUntil (string date). No markdown fences.';
    const userPrompt = `Generate a professional landscaping proposal for:
- Client: ${proposal.clientName}
- Project Scope: ${proposal.projectScope}
- Estimated Budget: $${proposal.estimatedBudget}
- Timeline: ${proposal.timeline}`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);

    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({
        error: result.error,
        fallback: result.fallback || false,
      });
    }

    const updateData = { aiProposal: result.data, status: 'generated' };
    if (result.structured) updateData.aiAnalysis = result.structured;
    await proposal.update(updateData);
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

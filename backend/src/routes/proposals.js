const express = require('express');
const ClientProposal = require('../models/ClientProposal');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const proposals = await ClientProposal.findAll({ order: [['createdAt', 'DESC']] });
    res.json(proposals);
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

router.post('/', auth, async (req, res) => {
  try {
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

router.post('/:id/generate', auth, async (req, res) => {
  try {
    const proposal = await ClientProposal.findByPk(req.params.id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const systemPrompt = 'You are an expert landscaping business consultant. Generate professional, persuasive client proposals that clearly communicate value, scope, timeline, and pricing. Format the proposal with professional sections suitable for client presentation.';
    const userPrompt = `Generate a professional landscaping proposal for:
- Client: ${proposal.clientName}
- Project Scope: ${proposal.projectScope}
- Estimated Budget: $${proposal.estimatedBudget}
- Timeline: ${proposal.timeline}

Create a comprehensive proposal including: executive summary, detailed scope of work, materials and plants list, project phases and timeline, pricing breakdown, warranty and maintenance terms, and terms & conditions.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await proposal.update({ aiProposal: aiResponse, status: 'generated' });
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

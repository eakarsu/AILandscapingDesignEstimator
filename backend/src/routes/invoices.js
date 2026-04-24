const express = require('express');
const Invoice = require('../models/Invoice');
const { queryOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ order: [['createdAt', 'DESC']] });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    await invoice.update(req.body);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    await invoice.destroy();
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/review', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    const systemPrompt = 'You are an expert landscaping business accountant specializing in invoice review and financial analysis. Provide detailed, professional invoice reviews with pricing accuracy checks, margin analysis, and billing recommendations. Format your response with clear sections using headers.';
    const userPrompt = `Review the following invoice:
- Invoice Number: ${invoice.invoiceNumber}
- Client Name: ${invoice.clientName}
- Project Name: ${invoice.projectName}
- Issue Date: ${invoice.issueDate}
- Due Date: ${invoice.dueDate}
- Line Items: ${invoice.lineItems}
- Subtotal: $${invoice.subtotal}
- Tax Rate: ${invoice.taxRate}%
- Total Amount: $${invoice.totalAmount}
- Status: ${invoice.status}
- Notes: ${invoice.notes}

Provide a comprehensive invoice review including: pricing accuracy assessment, market rate comparison, profit margin analysis, payment terms evaluation, potential discrepancies, tax compliance check, and recommendations for improving billing practices.`;

    const aiResponse = await queryOpenRouter(systemPrompt, userPrompt);
    await invoice.update({ aiInvoiceReview: aiResponse });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

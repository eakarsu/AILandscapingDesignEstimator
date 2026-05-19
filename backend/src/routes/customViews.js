const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// In-memory rules store (zones, costs) for plant/material rules editor
let rulesStore = {
  zones: [
    { id: 'z1', name: 'Zone 5a - Cold Temperate', minTemp: -28.9, maxTemp: -23.3, region: 'Northern US' },
    { id: 'z2', name: 'Zone 6b - Cool Temperate', minTemp: -20.6, maxTemp: -17.8, region: 'Mid-Atlantic' },
    { id: 'z3', name: 'Zone 7a - Mild Temperate', minTemp: -17.7, maxTemp: -15.0, region: 'Mid-South' },
    { id: 'z4', name: 'Zone 8b - Subtropical', minTemp: -9.4, maxTemp: -6.7, region: 'Coastal South' },
    { id: 'z5', name: 'Zone 9a - Warm Subtropical', minTemp: -6.6, maxTemp: -3.9, region: 'Florida/Gulf' },
  ],
  costs: [
    { id: 'c1', material: 'Mulch (cu yd)', unitCost: 45, laborCost: 30, markup: 0.25 },
    { id: 'c2', material: 'Topsoil (cu yd)', unitCost: 55, laborCost: 35, markup: 0.20 },
    { id: 'c3', material: 'Paver Stones (sq ft)', unitCost: 12, laborCost: 18, markup: 0.30 },
    { id: 'c4', material: 'Sod (sq ft)', unitCost: 1.25, laborCost: 0.75, markup: 0.22 },
    { id: 'c5', material: 'Irrigation drip line (lin ft)', unitCost: 2.10, laborCost: 1.50, markup: 0.28 },
  ],
};

let nextZoneId = 6;
let nextCostId = 6;

// 1. VIZ: Project cost breakdown chart - returns category-based cost data
router.get('/cost-breakdown', auth, async (req, res) => {
  try {
    const breakdown = [
      { category: 'Plants & Trees', amount: 4850, percent: 0.27, color: '#2d6a4f' },
      { category: 'Hardscape', amount: 5200, percent: 0.29, color: '#52b788' },
      { category: 'Irrigation', amount: 1850, percent: 0.10, color: '#40916c' },
      { category: 'Labor', amount: 4200, percent: 0.23, color: '#74c69d' },
      { category: 'Lighting', amount: 950, percent: 0.05, color: '#95d5b2' },
      { category: 'Soil/Mulch', amount: 1100, percent: 0.06, color: '#b7e4c7' },
    ];
    const total = breakdown.reduce((s, b) => s + b.amount, 0);
    res.json({
      project: 'Residential Backyard Redesign',
      total,
      currency: 'USD',
      generatedAt: new Date().toISOString(),
      breakdown,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2. VIZ: Plant zone suitability heatmap (plant x climate zone)
router.get('/zone-suitability', auth, async (req, res) => {
  try {
    const plants = ['Japanese Maple', 'Boxwood', 'Hydrangea', 'Lavender', 'Crepe Myrtle', 'Palm Sago', 'Rose Bush', 'Hosta'];
    const zones = ['5a', '6b', '7a', '8b', '9a'];
    // Each cell is a suitability score 0-100
    const matrix = [
      [55, 75, 90, 80, 60], // Japanese Maple
      [70, 90, 95, 88, 65], // Boxwood
      [60, 85, 95, 80, 55], // Hydrangea
      [80, 90, 88, 70, 50], // Lavender
      [10, 35, 70, 95, 95], // Crepe Myrtle
      [0,  0,  25, 75, 95], // Palm Sago
      [65, 88, 92, 85, 70], // Rose Bush
      [85, 95, 90, 70, 45], // Hosta
    ];
    res.json({
      plants,
      zones,
      matrix,
      scale: { min: 0, max: 100, label: 'Suitability %' },
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 3. NON-VIZ: Design quote PDF (returns text content; in real app would be PDF)
router.post('/quote-pdf', auth, async (req, res) => {
  try {
    const { projectName = 'Untitled Project', clientName = 'Client', items = [] } = req.body || {};
    const defaultItems = items.length ? items : [
      { description: 'Front yard plant installation', qty: 1, unit: 'job', unitPrice: 2400 },
      { description: 'Paver walkway', qty: 120, unit: 'sq ft', unitPrice: 18 },
      { description: 'Irrigation system installation', qty: 1, unit: 'job', unitPrice: 1850 },
      { description: 'Mulch & topsoil', qty: 8, unit: 'cu yd', unitPrice: 70 },
    ];
    const lineItems = defaultItems.map((it, idx) => ({
      lineNo: idx + 1,
      ...it,
      lineTotal: +(it.qty * it.unitPrice).toFixed(2),
    }));
    const subtotal = +lineItems.reduce((s, l) => s + l.lineTotal, 0).toFixed(2);
    const tax = +(subtotal * 0.07).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    const quoteId = `Q-${Date.now().toString(36).toUpperCase()}`;
    const pdfText = [
      '================================',
      'LANDSCAPE DESIGN QUOTE',
      '================================',
      `Quote ID: ${quoteId}`,
      `Project:  ${projectName}`,
      `Client:   ${clientName}`,
      `Issued:   ${new Date().toISOString().slice(0, 10)}`,
      '',
      'Line items:',
      ...lineItems.map(l => `  ${l.lineNo}. ${l.description} - ${l.qty} ${l.unit} @ $${l.unitPrice} = $${l.lineTotal}`),
      '',
      `Subtotal: $${subtotal}`,
      `Tax (7%): $${tax}`,
      `TOTAL:    $${total}`,
      '',
      'Valid 30 days. Thank you for choosing LandscapeAI Pro.',
    ].join('\n');

    res.json({
      quoteId,
      projectName,
      clientName,
      lineItems,
      subtotal,
      tax,
      total,
      currency: 'USD',
      pdfText,
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 4. NON-VIZ: Plant/material rules editor (CRUD zones, costs)
router.get('/rules', auth, async (req, res) => {
  res.json(rulesStore);
});

router.post('/rules', auth, async (req, res) => {
  try {
    const { type, item } = req.body || {};
    if (!type || !item) return res.status(400).json({ error: 'type and item required' });
    if (type === 'zone') {
      const newItem = { id: `z${nextZoneId++}`, ...item };
      rulesStore.zones.push(newItem);
      return res.status(201).json(newItem);
    }
    if (type === 'cost') {
      const newItem = { id: `c${nextCostId++}`, ...item };
      rulesStore.costs.push(newItem);
      return res.status(201).json(newItem);
    }
    res.status(400).json({ error: 'type must be zone|cost' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/rules/:type/:id', auth, async (req, res) => {
  const { type, id } = req.params;
  const list = type === 'zone' ? rulesStore.zones : type === 'cost' ? rulesStore.costs : null;
  if (!list) return res.status(400).json({ error: 'invalid type' });
  const idx = list.findIndex(x => x.id === id);
  if (idx < 0) return res.status(404).json({ error: 'not found' });
  list[idx] = { ...list[idx], ...req.body, id };
  res.json(list[idx]);
});

router.delete('/rules/:type/:id', auth, async (req, res) => {
  const { type, id } = req.params;
  const list = type === 'zone' ? rulesStore.zones : type === 'cost' ? rulesStore.costs : null;
  if (!list) return res.status(400).json({ error: 'invalid type' });
  const before = list.length;
  const filtered = list.filter(x => x.id !== id);
  if (type === 'zone') rulesStore.zones = filtered;
  else rulesStore.costs = filtered;
  res.json({ deleted: before - filtered.length });
});

module.exports = router;

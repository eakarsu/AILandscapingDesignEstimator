const express = require('express');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { queryOpenRouter, parseAIJson } = require('../services/openrouter');
const Project = require('../models/Project');
const CostEstimate = require('../models/CostEstimate');
const Plant = require('../models/Plant');
const router = express.Router();

// POST /api/ai/bid-score — score a project bid for competitiveness
router.post('/bid-score', auth, aiRateLimiter, async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ error: 'projectId is required' });

    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const costEstimates = await CostEstimate.findAll({ where: {} });
    const relatedEstimate = costEstimates.find(e => e.clientName === project.clientName) || costEstimates[0];

    const systemPrompt = 'You are an expert landscaping business analyst. Respond with valid JSON only, no markdown fences.';
    const userPrompt = `Score this landscaping bid for competitiveness.

Project:
- Title: ${project.title}
- Client: ${project.clientName || 'N/A'}
- Type: ${project.projectType || 'N/A'}
- Budget: $${project.budget || 0}
- Status: ${project.status}
${relatedEstimate ? `
Cost Estimate:
- Labor Cost: $${relatedEstimate.laborCost || 0}
- Material Cost: $${relatedEstimate.materialCost || 0}
- Equipment Cost: $${relatedEstimate.equipmentCost || 0}
- Total Estimate: $${relatedEstimate.totalEstimate || 0}
- Overhead: ${relatedEstimate.overheadPercent || 0}%
- Profit Margin: ${relatedEstimate.profitMarginPercent || 0}%
` : ''}

Return JSON: { bid_health_score (0-100), labor_cost_assessment, material_margin_assessment, client_budget_fit ("over" | "under" | "match"), risk_factors: [], recommendations: [] }`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({ error: result.error });
    }

    const structured = parseAIJson(result.data);
    res.json({ projectId: project.id, projectTitle: project.title, raw: result.data, structured });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/plant-recommendations — seasonal plant palette
router.post('/plant-recommendations', auth, aiRateLimiter, async (req, res) => {
  try {
    const { projectId, region, startDate } = req.body;
    if (!region) return res.status(400).json({ error: 'region is required' });

    let existingPlants = [];
    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) return res.status(404).json({ error: 'Project not found' });
    }
    existingPlants = await Plant.findAll({ limit: 50 });

    const systemPrompt = 'You are an expert horticulturalist and landscape designer. Respond with valid JSON only, no markdown fences.';
    const userPrompt = `Given region "${region}" and project start date "${startDate || 'unspecified'}", recommend a seasonal plant palette.

Existing plants in catalog: ${existingPlants.map(p => `${p.name} (zone: ${p.hardinessZone || 'N/A'}, bloom: ${p.bloomSeason || 'N/A'})`).slice(0, 20).join(', ')}

Return JSON: { recommended_plants: [{name, type, hardiness_zone, bloom_season, care_level, reason}], seasonal_considerations, hardiness_zone }`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({ error: result.error });
    }

    const structured = parseAIJson(result.data);
    res.json({ region, startDate, raw: result.data, structured });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/design-feasibility-check — validate a design against budget constraints
router.post('/design-feasibility-check', auth, aiRateLimiter, async (req, res) => {
  try {
    const { projectId, designSummary, targetBudget } = req.body;
    if (!projectId && !designSummary) {
      return res.status(400).json({ error: 'projectId or designSummary is required' });
    }

    let project = null;
    if (projectId) {
      project = await Project.findByPk(projectId);
      if (!project) return res.status(404).json({ error: 'Project not found' });
    }

    const systemPrompt = 'You are an expert landscape design feasibility analyst. Respond with valid JSON only, no markdown fences.';
    const userPrompt = `Evaluate whether the proposed landscape design is feasible within the budget.

Design summary: ${designSummary || (project && project.description) || 'N/A'}
Target budget: $${targetBudget || (project && project.budget) || 0}
${project ? `Project type: ${project.projectType || 'N/A'}\nClient: ${project.clientName || 'N/A'}` : ''}

Return JSON: { feasibility ("feasible" | "tight" | "infeasible"), estimated_total, budget_gap, key_drivers: [], cost_reductions: [], scope_warnings: [] }`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({ error: result.error });
    }
    const structured = parseAIJson(result.data);
    res.json({ projectId: project ? project.id : null, raw: result.data, structured });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/maintenance-cost-projector — project ongoing maintenance costs
router.post('/maintenance-cost-projector', auth, aiRateLimiter, async (req, res) => {
  try {
    const { projectId, region, yearsAhead = 3, propertySize, planSummary } = req.body;
    let project = null;
    if (projectId) {
      project = await Project.findByPk(projectId);
      if (!project) return res.status(404).json({ error: 'Project not found' });
    }

    const systemPrompt = 'You are an expert in landscape lifecycle costs. Respond with valid JSON only, no markdown fences.';
    const userPrompt = `Project ongoing maintenance costs for the next ${yearsAhead} years.

Region: ${region || 'N/A'}
Property size: ${propertySize || 'N/A'}
Plan: ${planSummary || (project && project.description) || 'N/A'}
${project ? `Project type: ${project.projectType || 'N/A'}` : ''}

Return JSON: { annual_cost_estimate, cost_breakdown: { labor, materials, irrigation, fertilizer, pest_control }, year_by_year: [{ year, total_cost }], cost_drivers: [], optimization_tips: [] }`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({ error: result.error });
    }
    const structured = parseAIJson(result.data);
    res.json({ projectId: project ? project.id : null, region, yearsAhead, raw: result.data, structured });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/crew-skill-matcher — Apply pass 4 backlog: match crew expertise to project needs
router.post('/crew-skill-matcher', auth, aiRateLimiter, async (req, res) => {
  try {
    const { projectNeeds, crewProfiles, projectId } = req.body;
    if (!projectNeeds && !projectId) {
      return res.status(400).json({ error: 'projectNeeds or projectId is required' });
    }
    let project = null;
    if (projectId) {
      project = await Project.findByPk(projectId);
      if (!project) return res.status(404).json({ error: 'Project not found' });
    }
    const systemPrompt = 'You are an expert landscape crew scheduling advisor. Respond with valid JSON only, no markdown fences.';
    const userPrompt = `Match crew skills to project needs.

Project needs: ${projectNeeds || (project && project.description) || 'N/A'}
${project ? `Project type: ${project.projectType || 'N/A'}\nBudget: $${project.budget || 0}` : ''}
Crew profiles: ${JSON.stringify(crewProfiles || [], null, 2)}

Return JSON: { recommended_crew: [{ crewId, name, fit_score, reasons: [] }], skill_gaps: [], training_suggestions: [], staffing_risks: [] }`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({ error: result.error });
    }
    const structured = parseAIJson(result.data);
    res.json({ projectId: project ? project.id : null, raw: result.data, structured });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/seasonal-demand-forecast — Apply pass 4 backlog: predict project volume by quarter
router.post('/seasonal-demand-forecast', auth, aiRateLimiter, async (req, res) => {
  try {
    const { region, historicalSummary, marketConditions, horizonQuarters = 4 } = req.body;
    if (!region && !historicalSummary) {
      return res.status(400).json({ error: 'region or historicalSummary is required' });
    }
    const systemPrompt = 'You are a landscape industry demand forecasting expert. Respond with valid JSON only, no markdown fences.';
    const userPrompt = `Forecast project volume by quarter for the next ${horizonQuarters} quarters.

Region: ${region || 'N/A'}
Historical summary: ${historicalSummary || 'N/A'}
Market conditions: ${marketConditions || 'N/A'}

Return JSON: { quarters: [{ quarter, expected_projects, revenue_band, confidence }], drivers: [], risks: [], staffing_recommendations: [] }`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({ error: result.error });
    }
    const structured = parseAIJson(result.data);
    res.json({ region, horizonQuarters, raw: result.data, structured });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/material-price-monitor — Apply pass 4 backlog: flag material cost inflation
router.post('/material-price-monitor', auth, aiRateLimiter, async (req, res) => {
  try {
    const { materials, region, recentQuotes } = req.body;
    if (!materials) {
      return res.status(400).json({ error: 'materials is required' });
    }
    const systemPrompt = 'You are a landscape materials pricing analyst. Respond with valid JSON only, no markdown fences.';
    const userPrompt = `Review materials and flag inflation or supply risks.

Region: ${region || 'N/A'}
Materials: ${typeof materials === 'string' ? materials : JSON.stringify(materials, null, 2)}
Recent quotes: ${recentQuotes ? (typeof recentQuotes === 'string' ? recentQuotes : JSON.stringify(recentQuotes, null, 2)) : 'N/A'}

Return JSON: { items: [{ material, trend, expected_change_pct, alternative_suggestions: [] }], overall_inflation_risk, hedging_recommendations: [] }`;

    const result = await queryOpenRouter(systemPrompt, userPrompt);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 502).json({ error: result.error });
    }
    const structured = parseAIJson(result.data);
    res.json({ region, raw: result.data, structured });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

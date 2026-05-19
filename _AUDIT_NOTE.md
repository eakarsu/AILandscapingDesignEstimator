# Audit Note — AILandscapingDesignEstimator

Source audit: `_AUDIT/reports/batch_05.md` § 4

## Original audit recommendations

### Missing AI endpoints
- `/design-feasibility-check` (validate design against budget constraints)
- `/crew-skill-matcher` (match crew expertise to project needs)
- `/seasonal-demand-forecast` (predict project volume by quarter)
- `/maintenance-cost-projector` (estimate ongoing maintenance costs)
- `/material-price-monitor` (flag material cost inflation, suggest alternatives)

### Missing non-AI features
- Project timeline / critical path (Gantt charts, dependency tracking)
- Equipment rental integration
- Customer portal
- Mobile crew app
- Compliance tracking (licenses, insurance, certifications)

### Custom feature suggestions
- Vision-based landscape audit
- Agentic crew scheduling
- Seasonal demand forecasting
- Material price aggregator
- Customer journey upsell
- White-label SaaS for franchises

## Implemented in this pass
1. **POST `/api/ai/design-feasibility-check`** — uses existing `Project` model + OpenRouter wrapper to assess feasibility against budget. Returns structured JSON `{ feasibility, estimated_total, budget_gap, ... }`.
2. **POST `/api/ai/maintenance-cost-projector`** — projects multi-year maintenance cost given region/size/plan summary.

Both follow the existing `routes/ai.js` style: `auth + aiRateLimiter` middleware, `queryOpenRouter`/`parseAIJson` services. No new dependencies. Syntax checked with `node -c`.

## Backlog (priority order)

### Mechanical (AI endpoints — straightforward to add)
- `/crew-skill-matcher` (needs Crew/Project models read; safe but more domain modeling)
- `/seasonal-demand-forecast` (needs historical project volume aggregation)
- `/material-price-monitor` (needs supplier feed → not purely mechanical)

### Needs product decision
- Gantt/critical path UI (requires schema migration for dependencies)
- Customer portal scope (auth model, view-only role)
- Mobile crew app (frontend scope explicitly out of bounds)

### Needs creds / external SDK
- Equipment rental integrations (vendor APIs)
- License/insurance compliance feeds (state-by-state APIs)
- Vision-based landscape audit (vision model + image storage)

## Apply pass 3 (frontend)

- **Stack:** CRA-style React + react-router, JWT Bearer via `services/api` axios instance (`localStorage.getItem('token')`).
- **Action:** LEFT-AS-IS — pass-2 endpoints already wired.
- **Notes:** `frontend/src/pages/AIToolsPage.js` declares a `TOOLS` array containing both pass-2 endpoints (`/ai/design-feasibility-check`, `/ai/maintenance-cost-projector`), each with form fields, calling `api.post(tool.endpoint, payload)`. Route `/ai-tools` registered in `App.js`. Backend returns 503 on missing key — surfaced via `e?.response?.data?.error`. Idempotence rule applied.

## Apply pass 4 (mechanical backlog)

- **Action:** LEFT-AS-IS — all three mechanical backlog items were already implemented in a prior pass-4 sweep.
- **Mechanical features verified present (BE + FE):**
  1. `POST /api/ai/crew-skill-matcher` — `backend/src/routes/ai.js`; surfaced as TOOLS entry in `frontend/src/pages/AIToolsPage.js`.
  2. `POST /api/ai/seasonal-demand-forecast` — `backend/src/routes/ai.js`; FE TOOLS entry.
  3. `POST /api/ai/material-price-monitor` — `backend/src/routes/ai.js`; FE TOOLS entry.
- **Helper pattern:** `auth` + `aiRateLimiter` + `queryOpenRouter`/`parseAIJson`; helper returns `{success:false, fallback:true}` on missing key → endpoint replies 503. FE uses `services/api` axios with JWT bearer; surfaces 503 via `e?.response?.data?.error`.
- **Backlog deferred:** Gantt/critical-path UI + Customer portal → NEEDS-PRODUCT-DECISION; Equipment rental + license/insurance feeds → NEEDS-CREDS; Vision-based audit, mobile crew app → TOO-RISKY.
- **Smoke test:** `node --check backend/src/routes/ai.js` PASS; live HTTP skipped (Postgres not provisioned).
- **Idempotence rule applied** — no duplicate routes, no new deps, no `npm install`.

# Completeness Review: AILandscapingDesignEstimator

- **Review date:** 2026-07-18
- **Assessment basis:** Static source and configuration inspection only. Dependencies were not installed, and no build, database migration, external integration, or runtime workflow was executed.

## Classification

**Prototype-demo**

## Verdict

The repository presents a broad design and project planning surface (139 source files and 39 route modules), but static evidence is characteristic of a generated prototype. Pages and endpoints demonstrate concepts; they do not establish a verified execution path to convert requirements and site constraints into editable, dimensioned alternatives, quantities, budgets, schedules, and deliverables.

## Why it is not complete

- 26 files are explicitly named as gap/gap-feature implementations; route/page count therefore overstates completed product capability.
- The route/page inventory includes `ai`, `clients`, `costs`, `crew scheduling agent`; these surfaces show breadth but not durable execution against authoritative systems.
- 34 files reference model-provider or chat-completion behavior; generic LLM calls are not a substitute for deterministic domain execution, grounding, or evaluation.
- 28 files contain mock, sample, placeholder, or random-data signals, leaving important outcomes disconnected from authoritative systems.
- Only 1 recognizable test file was found, insufficient to prove the full workflow and failure modes.
- No CI workflow was found to continuously verify builds, tests, migrations, or security checks.
- No environment example/template was found, so required configuration and secret boundaries are undocumented.

## Needed features

- 1. Implement a workflow to convert requirements and site constraints into editable, dimensioned alternatives, quantities, budgets, schedules, and deliverables.
- 2. Connect CAD/BIM/GIS, product/cost catalogs, render workers, contractors, object storage, and permitting sources; replace seed/demo records with durable synchronized data and explicit failure handling.
- 3. Validate dimensions, codes, constructability, quantities, costs, schedules, and render/export fidelity.
- 4. Track licensed assets and provenance, expose assumptions, and require qualified designer/contractor approval.
- 5. Add contract, integration, authorization, migration, and end-to-end tests in CI, plus a documented non-destructive deployment/run path.

## Risks or launch blockers

- Credential/secret fallback or demo-password patterns occur in 3 files and must be removed or made development-only.
- The root launcher can terminate unrelated processes occupying configured ports.
- The root launcher seeds, creates, migrates, or otherwise mutates database state during startup.
- The root launcher installs dependencies at run time, reducing reproducibility and expanding supply-chain risk.
- Ungrounded or malformed model output can become a domain action unless schemas, evidence, evaluations, and approval gates are added.

## Evidence inspected

- `backend/package.json` — declared scripts, runtime dependencies, and application boundaries.
- `frontend/package.json` — declared scripts, runtime dependencies, and application boundaries.
- `backend/src/models/index.js` — service composition, middleware, and registered routes.
- `backend/src/server.js` — service composition, middleware, and registered routes.
- `frontend/src/index.js` — service composition, middleware, and registered routes.
- `backend/src/routes/ai.js` — implemented API surface and domain/AI request handling.

## Recommended next action

Treat this as a prototype: use ai and clients to select one narrow design and project planning outcome, quarantine generated gap routes, and implement that outcome end to end with real data, deterministic rules, and tests before adding features.

## Implementation progress

**Local status:** The locally actionable governed design-estimate foundation is implemented. It is not a permit, stamped design, authoritative catalog quote, contractor acceptance, or completed CAD/render integration.

- **Needed feature 1 — implemented locally:** `backend/src/governance/domain.js`, the workflow router, and migration persist versioned requirements/surveys, constraints, editable alternatives, dimensions, material quantities and costs, dependency schedules, assumptions, deliverables, approvals, retirement, and export.
- **Needed feature 2 — bounded, externally blocked:** CAD/BIM, GIS, catalogs, render, contractor, object-storage, and permit operations are approval-gated outbox records with canonical idempotency, connector checkpoints, bounded retry/dead-letter behavior, and receipts. Real work requires provider credentials, mappings, licenses, and safe projects.
- **Needed feature 3 — implemented locally; authoritative verification blocked:** deterministic validation reconciles area, quantities/costs, schedule dependencies, versioned catalog inputs, code/permit review identifiers, constructability, dimensions, asset licensing, render review, and deliverable digests.
- **Needed feature 4 — implemented locally:** licensed asset/source provenance, mandatory assumptions, independent qualified-designer/contractor approval, tenant/RBAC isolation, scoped exports, immutable audit, credential rejection, and professional-review uncertainty form the local gate.
- **Needed feature 5 — implemented locally:** domain/contract/authorization/migration/integration/failure/lifecycle tests, CI, tracked blank config, operations docs, explicit migration, destructive-seed quarantine, and non-destructive startup are present. The maintained 10-test governance suite and optimized frontend build pass. Isolated runtime validation on PostgreSQL/API/UI ports `55574`/`5968`/`5969` recorded `2026-07-20T18:59:35Z AILandscapingDesignEstimator API_VERIFIED startup_login_session_api`, including login and authenticated-session verification; the AI-provider key remains mandatory outside test mode.
- **Risk closure:** generated/gap routes no longer mount by default, hard-coded demo passwords were removed, and startup no longer installs, migrates, seeds, or kills unrelated processes.

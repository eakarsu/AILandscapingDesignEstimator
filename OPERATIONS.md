# Governed landscape design operations

## Supported local boundary

The production-shaped path is `/api/governed-landscape-designs`. It persists versioned requirements and surveys, coordinate systems and constraints, editable alternatives, dimensions, quantities/catalog versions, reconciled budgets, schedules, asset rights, qualified reviews, and digested deliverables.

Drafts require independent approval before any export or provider work. Records are tenant-scoped, versioned, and backed by immutable events.

## Security and professional boundary

Authentication requires a strong JWT secret and signed tenant claim. Qualified designer, contractor, project manager, or admin roles may approve but cannot self-approve. Full work-item exports/events are creator/approver/admin scoped. Assumptions are mandatory; code, permit, constructability, and render review identifiers must be explicit. Local validation is not a permit, stamped design, site survey, bid, or construction authorization.

Idempotency keys are canonical-payload bound. Raw credentials are rejected; provider payloads use secret references only.

## Lifecycle

- `./start.sh check` is non-networking and non-mutating.
- `./start.sh start` requires locked dependencies already present and starts only owned processes.
- `ALLOW_SCHEMA_MIGRATION=true DATABASE_URL=... ./start.sh migrate` is an explicit reviewed operation.
- Startup never installs, seeds, migrates, kills ports, or starts database services. Destructive demo seeding is quarantined outside production and requires an explicit password.

Gap routes are unmounted; generated prototypes require an explicit non-production flag.

## External systems and failure

CAD/BIM, GIS, catalogs, rendering, contractor, object-storage, and permitting work is queued only from approved records. No adapter or credential is bundled. A worker must verify tenant/provider mappings, source/catalog versions, licensing, idempotency, render digests, and receipts before acknowledging delivery. Retry is bounded and dead-lettered. Real permitting, pricing, contractor acceptance, renders, and professional approval fail closed until qualified parties and authoritative systems are configured.

## Verification

Run `node --test backend/src/governance/tests/*.test.js`, changed-file `node --check`, and `bash -n start.sh`. CI checks domain reconciliation, professional-review fields, tenant/RBAC controls, migration, request hashing, outbox failure, and lifecycle safety. It does not execute CAD, rendering, providers, databases, or permit workflows.


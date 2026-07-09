# TASK-086: Evaluate Provider Registry And Capability Model

Evaluate whether ThinkIO needs a first-class provider registry before promoting remote model/provider integration.

## Why This Is Postponed

Provider identity, provider normalization, and provider output ingest already exist. A full registry should wait until the runtime composer needs real provider selection or TASK-072 is promoted.

## Candidate Scope If Promoted

- Provider IDs for GPT, Codex, Claude, local models, and tool providers.
- Capability profiles.
- Context-window and file-access limits.
- Trust/privacy profile.
- Output normalizer requirements.
- Rule overlays by provider.

## Required Evidence

- `provider-registry-scope-reviewed`
- `provider-capability-fields-evaluated`
- `remote-provider-promotion-trigger-defined`
## Completion

Completed on 2026-07-09 as part of the product expansion boundary pass. The outcome is documented in docs/product-expansion-boundaries.md and validated by 	ests/product-expansion-boundaries.test.ts.


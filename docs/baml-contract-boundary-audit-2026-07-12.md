# BAML Contract Boundary Audit

Date: 2026-07-12

## Summary

ThinkIO's BAML contracts were structurally misplaced.

The rebuild kept active `.baml` files directly under `contracts/`, while recovered ThinkIO v1.4 material used a nested `contracts/baml/` folder. That nesting is useful because `contracts/` can remain the general model-contract family while `contracts/baml/` contains BAML-specific files.

The active contracts have been moved to:

- `contracts/baml/build-context-packet.baml`
- `contracts/baml/classify-task.baml`
- `contracts/baml/detect-drift.baml`
- `contracts/baml/review-evidence.baml`

Validation now checks that no active `.baml` files live directly under `contracts/`.

## What BAML Is For In ThinkIO

BAML contracts should define model-facing structured input/output boundaries.

They are not canonical runtime state. They are not the source of truth for tasks, approvals, views, or project material.

They are useful when ThinkIO needs to ask a model to:

- classify loose text into a structured draft;
- route or summarize context;
- verify whether evidence satisfies a task;
- review a proposal;
- classify provider output;
- create a task proposal from a chat/composer exchange;
- produce a bounded plan that returns through governance.

The model can propose structured output through a BAML contract, but ThinkIO must still route that output through provider normalization, governance decision, validation, and approved mutation boundaries before anything becomes canonical.

## Current Contract Coverage

Existing rebuild contracts:

- `classify-task`: useful for turning loose user/model input into task draft fields.
- `build-context-packet`: useful for model context assembly.
- `review-evidence`: useful for evidence satisfaction checks.
- `detect-drift`: useful for comparing implementation/state drift.

Expanded current contracts:

- `classify-project-material`: classify docs/imports/reports as canonical, generated, historical, review-needed, stale, or rejected.
- `route-task-context`: model-facing context routing distinct from deterministic runtime context packet assembly.
- `verify-proof-package`: check whether evidence, tests, reports, and changed files satisfy a governed task.
- `summarize-human-review`: produce bounded review summaries without creating canonical state.
- `propose-refactor-batch`: plan file/task changes as proposals, never direct writes.
- `compose-task-proposal`: convert Runtime Composer input into a task proposal.
- `classify-provider-output`: classify returned model/provider output before ingestion.
- `review-governance-decision`: explain blockers, approval requirements, and next valid action.
- `translate-reentry-responsibility`: translate old reentry/session-continuity language into current native owners.

## Recovered v1.4 Contract Signals

The recovered material included:

- `classify_item.baml`
- `route_task_context.baml`
- `verify_proof_package.baml`
- `refactor_batch_plan.baml`
- `human_review_summary.baml`

These suggest the older architecture expected BAML to cover project-material classification, context routing, proof verification, batch planning, and human-review summaries.

## Missing Contracts For Current ThinkIO

Recommended additions now covered as contract files:

- `classify-project-material`: classify docs/imports/reports as canonical, generated, historical, review-needed, stale, or rejected.
- `route-task-context`: model-facing context routing distinct from deterministic runtime context packet assembly.
- `verify-proof-package`: check whether evidence, tests, reports, and changed files satisfy a governed task.
- `summarize-human-review`: produce bounded review summaries without creating canonical state.
- `propose-refactor-batch`: plan file/task changes as proposals, never direct writes.
- `compose-task-proposal`: convert Runtime Composer input into a task proposal.
- `classify-provider-output`: classify returned model/provider output before ingestion.
- `review-governance-decision`: explain blockers, approval requirements, and next valid action.
- `translate-reentry-responsibility`: translate old reentry/session-continuity language without reviving reentry prompts as authority.

## Tooling Boundary

There is a second issue separate from folder nesting.

Official BAML projects commonly use `baml_src/` plus generated clients. ThinkIO currently uses `contracts/baml/` as an architectural boundary, not as a proven BAML CLI project.

That is acceptable for documentation and planning today, but before real provider/model execution is added, ThinkIO should decide whether to:

- keep BAML files as contract documentation only;
- mirror or migrate them into a BAML CLI-compatible `baml_src/` folder;
- generate a TypeScript client and validate it in CI;
- keep generated clients out of canonical runtime until provider integration is approved.

Current decision: `contracts/baml/` remains the canonical contract-documentation boundary. Generated BAML clients are not enabled yet, and provider integration is not considered ready until a future task explicitly approves `baml_src/` or an equivalent generator boundary.

Validation command:

```text
npm run validate:baml
```

## Recommendation

Do both:

1. Keep the immediate `contracts/baml/` nesting fix.
2. Add a candidate task to expand ThinkIO's model-facing BAML contract set.
3. Add a candidate task to evaluate BAML CLI/generator compatibility before real model-provider integration.

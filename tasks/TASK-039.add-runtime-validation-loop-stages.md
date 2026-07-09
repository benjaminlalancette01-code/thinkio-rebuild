# TASK-039: Add Runtime Validation Loop Stages

Wrap model/app handoff and state mutation in staged validation.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

High. Plausible model output must be checked before it can affect ThinkIO state.

## Subtasks

- Define validation stages: pre-export, post-export, post-provider, pre-ingest, and post-ingest.
- Add stage-specific validation result records.
- Connect validation stages to governance decisions.
- Refresh board, mind-map, and dashboard views after accepted writes.
- Add tests for stage order and blocker propagation.

## Required Evidence

- `validation-stage-model-defined`
- `pre-export-validation-added`
- `post-provider-validation-added`
- `post-ingest-validation-tests-pass`

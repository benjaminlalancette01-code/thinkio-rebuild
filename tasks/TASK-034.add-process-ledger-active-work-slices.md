# TASK-034: Add Process Ledger And Active Work Slices

Add local process memory so active work does not have to be reconstructed from chat.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

High. Model handoff depends on knowing the active slice of work and what changed around it.

## Subtasks

- Define process ledger records for runtime events, decisions, state transitions, and validation outcomes.
- Define active work slices for bounded model context.
- Link slices to task, step, branch, artifact, context card, and validation state.
- Add validation for stale or conflicting active slices.
- Add tests for ledger append and slice construction.

## Required Evidence

- `process-ledger-model-defined`
- `active-work-slice-model-defined`
- `ledger-validation-added`
- `process-ledger-tests-pass`

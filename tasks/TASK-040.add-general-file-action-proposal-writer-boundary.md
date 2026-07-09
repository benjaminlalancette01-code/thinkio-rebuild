# TASK-040: Add General File Action Proposal Model And Writer Boundary

Extend governed mutation beyond task-state updates into general file action proposals.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

High. The model should never write files directly.

## Subtasks

- Define file action proposals for read, create, update, delete, rename, move, export, and import actions.
- Classify proposal risk and required approval.
- Route approved writes through a governed writer boundary.
- Preserve rollback and checkpoint links for mutation-sensitive file actions.
- Add tests for allowed, blocked, and approval-required actions.

## Required Evidence

- `file-action-proposal-model-defined`
- `writer-boundary-integrated`
- `file-action-risk-routing-added`
- `file-action-tests-pass`

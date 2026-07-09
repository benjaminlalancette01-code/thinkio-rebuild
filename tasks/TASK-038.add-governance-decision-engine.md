# TASK-038: Add Governance Decision Engine

Turn approval, authority, mode, validation, and output class checks into one runtime decision point.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

High. Model outputs and file actions need consistent allow, approval-required, block, or defer decisions.

## Subtasks

- Define governance decision records.
- Define action type and sensitivity vocabulary.
- Evaluate actions against mode, authority, status, validation state, and task scope.
- Return clear blocker reasons and allowed next actions.
- Add tests for model output, board movement, and file action decisions.

## Required Evidence

- `governance-decision-record-defined`
- `action-sensitivity-classifier-added`
- `mode-authority-validation-integrated`
- `governance-decision-tests-pass`

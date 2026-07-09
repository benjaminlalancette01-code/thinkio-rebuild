# TASK-025: Formalize Authority Transition Model

Convert the report finding that authority transitions are not independently modeled into a governed kernel task.

Source report: `audit/current-state-report-2026-06-30.md`.

## Risk

High. Atomic mutation application should not be introduced until allowed authority movement is explicit.

## Subtasks

- Define allowed authority transitions.
- Decide whether status transitions imply authority transitions or whether authority must always be supplied explicitly.
- Add kernel helpers for authority transition validation and blocker explanations.
- Wire mutation transaction validation through the authority transition rules.
- Add focused tests.

## Required Evidence

- `missing-work-task-created`
- `authority-transition-rules-added`
- `authority-transition-test-pass`

# TASK-030: Add Native Step/Workboard Model

Convert the report finding that task status is too coarse into a native operational workboard.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

High. Model ingestion, mode policy, and native UI state all need a stable place to land work.

## Subtasks

- Define `Workboard`, `WorkStep`, and workflow positions: current, queued next, deferred, resolved, and idea/intake.
- Enforce the one-current-step invariant.
- Keep workflow position separate from task authority/status.
- Add validation for parent/child steps, order, and artifact links.
- Add tests for valid and invalid board state.

## Required Evidence

- `workboard-model-defined`
- `one-current-step-invariant-defined`
- `workboard-validation-added`
- `workboard-tests-pass`

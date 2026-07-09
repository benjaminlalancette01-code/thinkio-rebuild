# TASK-023: Gate Task Runner With Windows And Approvals

Resolve the audit finding that `prepareTaskRun` bypasses execution windows and approval boundaries.

Source audit: `audit/runtime-kernel-dependency-audit-2026-06-28.md`.

## Subtasks

- Decide whether task-run preparation is shallow preview or full guarded preparation.
- If guarded, accept execution-window and approval inputs.
- Include execution-window and approval blockers in prepared runs.
- Add focused tests.

## Required Evidence

- `candidate-note-created`
- `task-runner-boundary-gates-added`
- `task-runner-boundary-test-pass`

# TASK-013: Import Approval Boundary Runtime

Import one concept from the identity audit: authority-affecting actions need explicit approval boundaries.

This task should wire local approval checks into governed runtime behavior without adding external services.

## Subtasks

- Define approval lookup and validation helpers.
- Reuse the existing approval type, schema, and state file.
- Decide which local actions require approval.
- Add tests for missing and present approvals.

## Required Evidence

- `candidate-note-created`
- `approval-boundary-rule-added`
- `approval-boundary-test-pass`


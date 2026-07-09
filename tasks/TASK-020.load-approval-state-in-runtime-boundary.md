# TASK-020: Load Approval State In Runtime Boundary

Resolve the audit finding that approval helpers accept in-memory approvals but do not read canonical `state/approvals.json`.

Source audit: `audit/runtime-kernel-dependency-audit-2026-06-28.md`.

## Subtasks

- Add a small approval-state reader.
- Let runtime approval checks load `state/approvals.json` by default.
- Keep injectable approval records available for tests.
- Add tests for missing file, empty approvals, and present approval.

## Required Evidence

- `candidate-note-created`
- `approval-state-reader-added`
- `approval-state-runtime-test-pass`

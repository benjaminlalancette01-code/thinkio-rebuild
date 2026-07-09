# TASK-041: Add Closeout History/Version Validation Model

Translate v1.1.1 closeout into local history, versioning, validation, and rollback anchors.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

Medium-high. Long-running work needs recoverable handoff points even without chat reentry.

## Subtasks

- Define closeout records with scope, reason, active step, branch, validation runs, changed artifacts, and rollback anchors.
- Link closeout to checkpoint and mutation rollback records.
- Record next valid action after closeout.
- Add validation for incomplete or stale closeout records.
- Add tests for closeout creation and validation.

## Required Evidence

- `closeout-record-model-defined`
- `history-version-validation-added`
- `rollback-anchor-linking-added`
- `closeout-tests-pass`

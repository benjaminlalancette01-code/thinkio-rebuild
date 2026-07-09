# TASK-018: Wire Approved Mutation Transaction Planning

Resolve the audit finding that `plan-mutation-transaction` is approval-required but not wired as a local runtime action.

Source audit: `audit/runtime-kernel-dependency-audit-2026-06-28.md`.

## Subtasks

- Add a local runtime mutation-planning entrypoint.
- Gate it through the command registry and approval boundary.
- Reuse `kernel/mutation-transaction.ts` for record creation and validation.
- Add focused tests for missing and present approval.

## Required Evidence

- `candidate-note-created`
- `approved-mutation-planner-wired`
- `approved-mutation-planner-test-pass`

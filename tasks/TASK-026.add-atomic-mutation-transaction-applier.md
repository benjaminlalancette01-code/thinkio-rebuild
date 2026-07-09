# TASK-026: Add Atomic Mutation Transaction Applier

Convert the report finding that mutation transactions can be planned but not applied atomically into a governed runtime task.

Source report: `audit/current-state-report-2026-06-30.md`.

## Risk

High. This moves ThinkIO from planning and validation into multi-file state-changing runtime behavior.

## Subtasks

- Consume a validated `MutationTransactionRecord`.
- Revalidate status, authority, evidence, checkpoint, and ledger effects immediately before writing.
- Apply task JSON, checkpoint state, ledger state, and rollback metadata as one guarded operation.
- Use temp-file writes or an equivalent safe write strategy.
- Add rollback-focused tests and failure-path tests.

## Required Evidence

- `missing-work-task-created`
- `atomic-mutation-applier-added`
- `mutation-applier-rollback-test-pass`

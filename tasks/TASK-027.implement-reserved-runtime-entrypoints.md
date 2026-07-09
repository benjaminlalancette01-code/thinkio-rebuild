# TASK-027: Implement Reserved Runtime Entrypoints

Convert the report finding that the command registry still has reserved-but-unimplemented actions into a governed runtime task.

Source report: `audit/current-state-report-2026-06-30.md`.

## Risk

Medium. These commands are less dangerous than mutation application, but the allow-list should not imply runtime support that does not exist.

## Subtasks

- Implement or remove `validate-json-task-files`.
- Implement or remove `validate-transitions`.
- Implement or remove `run-tests`.
- Keep the command registry aligned with actual runtime entrypoints.
- Add tests proving implemented and reserved action lists stay honest.

## Required Evidence

- `missing-work-task-created`
- `reserved-runtime-entrypoints-implemented`
- `reserved-runtime-entrypoint-test-pass`

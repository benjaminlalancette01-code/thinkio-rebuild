# TASK-043: Replace External Kanban Dependency With Native ThinkIO Board Projection

Make the Kanban board a projection of ThinkIO runtime state rather than an external source of truth.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

Medium-high. UI work should not begin on top of a board model that cannot enforce runtime rules.

## Subtasks

- Define native board projection shape from task, workboard, validation, friction, and authority state.
- Preserve `.devtool/features` cards as visual mirrors until two-way sync is explicitly implemented.
- Define board actions and their runtime command boundaries.
- Add projection tests for lanes, ordering, blockers, and dependencies.
- Update documentation if the Kanban boundary changes.

## Required Evidence

- `native-board-projection-model-defined`
- `kanban-mirror-boundary-preserved`
- `board-action-contract-added`
- `board-projection-tests-pass`

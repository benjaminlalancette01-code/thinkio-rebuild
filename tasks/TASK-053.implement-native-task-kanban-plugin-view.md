# TASK-053: Implement Native Task Kanban Plugin View

Plan and implement the ThinkIO-owned Kanban view for governed tasks and workboard state.

## Risk

High. Kanban is the primary task surface and must not drift into a second source of truth.

## Subtasks

- Render lanes for current, queued next, deferred, resolved, idea/intake, and task status groupings where needed.
- Show task authority, blockers, dependencies, friction markers, and validation status.
- Route card movement through governance decisions and runtime commands.
- Preserve `.devtool/features` as visual mirrors, not the plugin's source of truth.
- Add tests for lane membership, ordering, blockers, and action routing.

## ThinkIO Alignment

- Uses TASK-043 native board projection.
- Does not mutate `tasks/*.json` directly.
- Drag/drop is a proposal unless runtime governance allows it.

## Required Evidence

- `native-task-kanban-view-defined`
- `kanban-lanes-map-runtime-state`
- `kanban-actions-route-through-runtime`
- `kanban-plugin-view-tests-pass`

## Completion Evidence

- `kernel/plugin-view-contracts.ts` defines the plugin-facing Kanban view contract.
- `kernel/runtime-projections.ts` provides the native board projection consumed by the view.
- `tests/plugin-view-contracts.test.ts` verifies Kanban source-of-truth and action routing.

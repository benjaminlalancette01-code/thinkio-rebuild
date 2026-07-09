# TASK-056: Define VS Code Plugin Command And Data Bridge

Define the bridge between VS Code views and ThinkIO runtime commands/data providers.

## Risk

High. If views call files directly, the plugin bypasses ThinkIO governance.

## Subtasks

- Define data providers for task board, artifact mind map, runtime node diagram, context panel, and proposal review.
- Define commands for refresh, select, open record, create work package, ingest provider output, request approval, defer, reject, and apply approved proposal.
- Map every command to an existing or planned runtime boundary.
- Keep chat/model interaction attached to runtime records.
- Add tests for command registration and blocked direct-write behavior.

## ThinkIO Alignment

- Uses runtime command registry as the allowed action surface.
- Maintains chat as non-canonical attached context.
- Makes plugin views consumers of projections, not direct writers.

## Required Evidence

- `plugin-command-bridge-defined`
- `plugin-view-data-provider-contract-added`
- `runtime-command-routing-added`
- `plugin-bridge-tests-pass`

## Completion Evidence

- `kernel/plugin-view-contracts.ts` defines plugin command routes and data provider contracts.
- `docs/thinkio-full-spec-sheet.md` documents the plugin command bridge.
- `tests/plugin-view-contracts.test.ts` verifies command coverage and blocked direct mutation.

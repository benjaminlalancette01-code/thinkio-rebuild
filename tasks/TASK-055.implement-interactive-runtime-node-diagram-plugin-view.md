# TASK-055: Implement Interactive Runtime Node Diagram Plugin View

Plan and implement the ThinkIO-owned interactive node diagram for runtime flow, validation stages, provider handoff, derivation, and write governance.

## Risk

High. The diagram must not become an ungoverned visual editor or dependency on another plugin.

## Subtasks

- Define runtime-flow node types for task, step, package, provider output, validation stage, governance decision, file action proposal, checkpoint, and closeout.
- Define edge types for exports-to, ingests-from, validates, blocks, approves, writes-through, checkpoints, and rolls-back-to.
- Support selection, focus path, expand/collapse, and blocker inspection.
- Keep geometry/layout as optional view metadata only.
- Add tests proving diagram interactions route through runtime commands and do not mutate canonical state directly.

## ThinkIO Alignment

- Uses TASK-039 validation stages, TASK-044 derivation receipts, and TASK-048 provider ingest.
- Uses TASK-015 geometry boundary: layout metadata is not authority.
- No external node-diagram plugin is required at runtime.

## Required Evidence

- `interactive-node-diagram-view-defined`
- `runtime-flow-node-edge-contract-added`
- `diagram-interactions-route-through-runtime`
- `node-diagram-tests-pass`

## Completion Evidence

- `kernel/plugin-view-contracts.ts` defines the interactive runtime node diagram contract.
- `docs/thinkio-full-spec-sheet.md` documents diagram interactions and geometry-as-metadata rules.
- `tests/plugin-view-contracts.test.ts` verifies blocker inspection and non-authoritative geometry.

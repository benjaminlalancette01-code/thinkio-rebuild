# TASK-054: Implement Artifact Mind-Map Plugin View

Plan and implement the ThinkIO-owned artifact mind map, similar to a second-brain graph, for artifacts, sources, context, tasks, rules, derivations, and validation records.

## Risk

Medium-high. A graph view can become decorative noise unless it remains tied to canonical runtime records.

## Subtasks

- Render artifact, source, task, rule, context card, derivation, friction, validation, and work package nodes.
- Render edges such as depends-on, derived-from, validates, blocks, attached-to, exports-to, ingests-from, and promotes-to.
- Support filtering by selected task, artifact, source, authority, validation state, and friction.
- Route node actions through runtime commands.
- Add deterministic projection and ordering tests.

## ThinkIO Alignment

- Uses TASK-049 runtime mind-map projection.
- Artifact provenance comes from ledger and artifact-chain records.
- Context cards remain non-canonical until reviewed/promoted.

## Required Evidence

- `artifact-mindmap-view-defined`
- `artifact-source-context-node-types-added`
- `mindmap-actions-route-through-runtime`
- `artifact-mindmap-tests-pass`

## Completion Evidence

- `kernel/plugin-view-contracts.ts` defines the plugin-facing artifact mind-map contract.
- `kernel/runtime-projections.ts` provides deterministic runtime mind-map nodes and edges.
- `tests/plugin-view-contracts.test.ts` verifies supported node/edge kinds and runtime projection use.

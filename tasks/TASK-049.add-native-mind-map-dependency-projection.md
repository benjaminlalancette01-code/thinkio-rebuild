# TASK-049: Add Native Mind-Map Dependency Projection

Make the mind map a runtime projection of sources, artifacts, rules, tasks, context, validation, friction, and derivation.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

Medium. The UI needs dependency visibility before it can safely guide model handoff and user decisions.

## Subtasks

- Define mind-map node types for task, step, source, artifact, rule, context card, branch, work package, provider output, derivation, friction, and validation run.
- Define edge types such as depends-on, derived-from, validates, blocks, attached-to, exports-to, ingests-from, and promotes-to.
- Build projection from canonical runtime state.
- Add tests for node/edge generation and ordering.
- Keep projection deterministic.

## Required Evidence

- `mindmap-node-vocabulary-defined`
- `mindmap-edge-vocabulary-defined`
- `runtime-state-projection-added`
- `mindmap-projection-tests-pass`

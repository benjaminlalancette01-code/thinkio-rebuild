# TASK-083: Repair Project Graph Coverage And Validation

Repair the current graph/projection drift found during the 2026-07-08 design recovery comparison.

## Why This Is Now

`state/project.graph.json` currently contains task nodes only through `TASK-029`, while canonical task files run through `TASK-082`.

Generated views can partially compensate by reading all task files, but the persisted project graph state should not silently drift from the current task graph.

This directly affects the VS Code plugin goal because the artifact mind-map and runtime node diagram depend on trusted graph/projection state.

This task should run before Extension Host hardening so plugin view behavior is tested against coherent project graph state.

## Subtasks

- Decide and document whether `state/project.graph.json` is canonical state, generated state, or projection support data.
- Update graph generation or graph state so all current governed tasks are represented.
- Add validation that detects missing task nodes.
- Add validation that detects missing dependency edges.
- Confirm `views/mindmap.json` and runtime diagram projections remain aligned after update.
- Add tests for graph coverage and missing-node/missing-edge detection.

## ThinkIO Alignment

- Keeps project-centered state coherent.
- Prevents plugin views from hiding stale state.
- Supports the current VS Code plugin hardening path without expanding into full product scope.

## Required Evidence

- `project-graph-covers-current-task-range`
- `project-graph-validation-detects-missing-task-nodes`
- `dependency-edge-coverage-validated`
- `graph-authority-boundary-documented`

## Completion Evidence

- `kernel/view-projections.ts` now generates project graph task nodes and dependency edges from governed task JSON.
- `kernel/view-projections.ts` validates missing task nodes, stale labels, non-task task nodes, missing dependency edges, and missing dependency targets.
- `runtime/update-views.ts` rewrites `state/project.graph.json` during view refresh.
- `docs/project-graph-boundary.md` documents the graph as generated support state while task JSON remains canonical.
- `tests/view-projections.test.ts` covers generated graph coverage and stale graph detection.
- `state/project.graph.json` now covers all current governed task files.

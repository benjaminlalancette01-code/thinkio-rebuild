# Project Graph Boundary

## Purpose

`state/project.graph.json` is generated project-graph support state.

Canonical task truth remains in `tasks/*.json`.

The graph exists so views can inspect task relationships without recomputing every edge by hand. It must stay aligned with the canonical task set.

## Generation Rule

`npm run update:views` reads:

- governed task JSON from `tasks/`;
- existing graph support state from `state/project.graph.json`;
- deferred state from `state/deferred.json`.

It then rewrites:

- `state/project.graph.json`;
- `views/kanban.json`;
- `views/mindmap.json`;
- `views/dashboard.json`.

Task nodes and task dependency edges are generated from `tasks/*.json`.

Non-task graph nodes and non-task edges may remain in the graph as support data.

## Validation Rule

Project graph coverage must detect:

- missing task nodes;
- stale task labels;
- task nodes with non-task type;
- missing dependency edges;
- dependency targets missing from the graph.

The graph must not silently hide stale task coverage from plugin views.

## Plugin Alignment

The VS Code plugin reads generated projections. It does not treat graph layout, node position, or visual metadata as authority.

The graph supports artifact mind-map and runtime node diagram behavior, but canonical task status, authority, dependency, and evidence fields still live in governed task JSON.

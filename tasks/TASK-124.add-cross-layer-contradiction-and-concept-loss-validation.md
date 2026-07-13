# TASK-124: Add Cross-Layer Contradiction And Concept-Loss Validation

Detect cases where docs, tasks, state, runtime, UI, Git, or historical translation records disagree.

## Required Work

- Define contradiction checks across task status, authority, implementation, docs, projections, and package state.
- Add concept-loss validation so accepted historical responsibilities cannot disappear silently.
- Wire the validator into `npm run check`.
- Add fixtures for stale docs, done-without-implementation, and missing capability mapping.

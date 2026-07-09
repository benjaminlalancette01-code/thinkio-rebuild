# TASK-015: Evaluate Geometry View Projection Metadata

Evaluate whether the old identity-audit geometry can be represented as optional view metadata.

This task must not let geometry define task authority or kernel transition rules.

Deferred behind `TASK-014`, which is now sequenced after the runtime/kernel audit remediation tasks.

## Subtasks

- Decide whether geometry belongs in generated views, docs, or rejection.
- If useful, define only projection metadata.
- Add a test proving projection metadata does not alter task status or authority.

## Required Evidence

- `candidate-note-created`
- `geometry-projection-decision-recorded`
- `geometry-projection-test-pass`

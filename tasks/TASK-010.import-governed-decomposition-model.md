# TASK-010: Import Governed Decomposition Model

Import one concept from the identity audit: safe decomposition when a governed unit saturates.

This task must define how a task can be split into smaller governed tasks while preserving dependency, evidence, checkpoint, and reconstruction paths.

## Subtasks

- Define a minimal decomposition record.
- Add a CUE schema for decomposition records.
- Add local kernel logic that validates parent and child task relationships.
- Add state seed data only if needed for a test fixture.
- Add focused tests.

## Required Evidence

- `candidate-note-created`
- `decomposition-schema-added`
- `decomposition-rule-test-pass`


# TASK-011: Import Reconstruction Replay Validation Model

Import one concept from the identity audit: validating that accepted state can be reconstructed from current records.

This task should validate replay readiness only. It must not activate a full autonomous replay runtime.

## Subtasks

- Define a minimal replay validation manifest.
- Check that required state files and accepted artifacts are present.
- Connect replay validation to checkpoints, ledger, artifact chains, and project graph.
- Add focused tests.

## Required Evidence

- `candidate-note-created`
- `replay-validation-schema-added`
- `replay-validation-test-pass`


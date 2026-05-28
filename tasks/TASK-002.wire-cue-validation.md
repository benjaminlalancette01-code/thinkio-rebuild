# TASK-002: Wire CUE Validation Into Runtime

Add local development runtime support for validating JSON task data against CUE schemas.

This task does not install CUE. It creates a runtime boundary that can call the local `cue` executable when present and can be tested with an injected command runner.

## Required Evidence

- `cue-validation-target-defined`
- `cue-validation-runtime-rule`
- `cue-validation-test-pass`


# TASK-031: Add Parallel Branch And Return-Anchor Model

Convert the v1.1.1 branch/parallel-work behavior into local runtime state.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

High. ThinkIO must track parallel work without depending on chat memory.

## Subtasks

- Define branch records with purpose, status, parent step, active step, and success condition.
- Add return anchors for deferred or parallel branches.
- Validate that branches can be paused, resumed, completed, or rejected without losing history.
- Connect branch records to workboard state and mind-map dependencies.
- Add tests for branch lifecycle and return-anchor validity.

## Required Evidence

- `branch-anchor-model-defined`
- `return-anchor-rules-added`
- `parallel-branch-validation-added`
- `branch-tests-pass`

# TASK-050: Add User-To-ThinkIO-To-Model Interaction Surface Contract

Define how the user, ThinkIO UI/runtime, and model/app surface interact without turning chat into the source of truth.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

Medium. This should follow the state models so the eventual UI is built on runtime truth.

## Subtasks

- Define what the user can ask from the ThinkIO interaction surface.
- Define how selected task, step, artifact, source, rule, and context slice shape the model/app handoff.
- Define visible states for draft, proposal, blocked, approval required, validated, ingested, and rejected output.
- Define how chat sessions attach to runtime records without becoming canonical state.
- Add validation or documentation proving the boundary is implementable.

## Required Evidence

- `interaction-surface-contract-defined`
- `chat-session-state-boundary-defined`
- `model-action-visibility-rules-added`
- `interaction-surface-validation-note-added`

# TASK-059: Add Plugin Interaction Log Boundary Model

Define the VS Code plugin interaction log as an attached runtime record, not canonical ThinkIO state.

Source report: `audit/v1.1.1-plugin-interaction-emulation-gap-report-2026-07-03.md`.

## Risk

High. If chat/session logs are confused with event history, model conversation can silently become state authority.

## Subtasks

- Define plugin interaction log records for user prompts, model replies, command intents, selected context, result references, and follow-up actions.
- Preserve the boundary between canonical event history, process ledger entries, plugin UI traces, adapter convenience logs, and prompt transcripts.
- Define when transcript-grade preservation is required, optional, or explicitly out of scope.
- Define retention and redaction expectations for selected context slices and provider/model labels.
- Add validation or tests proving interaction logs cannot mutate task status, authority, checkpoint state, or files.

## ThinkIO Alignment

- Uses the v1.1.1 canonical term `interaction log` for prompt/reply continuity material.
- Keeps canonical event history owned by core/governance, not plugin chat or model adapters.
- Treats chat-like plugin interaction as evidence and context, not acceptance.

## Required Evidence

- `plugin-interaction-log-boundary-defined`
- `canonical-event-log-separation-preserved`
- `transcript-preservation-policy-added`
- `interaction-log-validation-added`

## Completion Evidence

- `kernel/plugin-view-contracts.ts` defines plugin interaction log records and validation.
- `docs/vscode-plugin-runtime-shell.md` and `docs/thinkio-full-spec-sheet.md` document the interaction log boundary.
- `tests/plugin-view-contracts.test.ts` verifies interaction logs attach to runtime records and cannot mutate canonical state.

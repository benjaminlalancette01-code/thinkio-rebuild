# TASK-061: Add Plugin Runtime Composer Result Surface

Define the plugin composer/result surface that lets users interact with a model through selected ThinkIO context.

Source report: `audit/v1.1.1-plugin-interaction-emulation-gap-report-2026-07-03.md`.

## Risk

High. A generic chat transcript would bypass the artifact-first runtime surface described in v1.1.1.

## Subtasks

- Define the plugin `RuntimeInteractionRegion` equivalent for VS Code: context bar, composer, result view, and follow-up actions.
- Define result states for empty, proposal, approval required, blocked, approved, applied, rejected, and deferred pending write.
- Bind composer submissions to selected task, artifact, context card, work slice, provider/model label, and command mode.
- Ensure model results are displayed as governed runtime results, not as generic conversation history.
- Add tests or validation proving result follow-up actions route through runtime commands.

## ThinkIO Alignment

- Carries forward the v1.1.1 runtime composer rule into the VS Code plugin shell.
- Keeps model interaction artifact-first and governance-visible.
- Uses proposal/result states as the visible bridge between chat-like input and ThinkIO runtime truth.

## Required Evidence

- `runtime-composer-surface-contract-defined`
- `runtime-result-state-model-added`
- `generic-chat-transcript-blocked`
- `composer-result-tests-pass`

## Completion Evidence

- `kernel/plugin-view-contracts.ts` defines runtime composer result states and validation.
- `docs/vscode-plugin-runtime-shell.md` and `docs/thinkio-full-spec-sheet.md` document the composer/result surface.
- `tests/plugin-view-contracts.test.ts` verifies selected context and blocks generic transcript behavior.

# TASK-063: Evaluate Historical Chat Log Import Policy

Decide whether old prompt/reply logs, transcripts, or session logs should ever be imported into the current interaction-log model.

Source report: `audit/v1.1.1-plugin-interaction-emulation-gap-report-2026-07-03.md`.

## Risk

Medium. Historical logs can help continuity, but importing them without authority boundaries could reintroduce archive drift.

## Subtasks

- Identify which historical transcript/log artifacts are evidence-only and which, if any, can become structured interaction-log records.
- Define import constraints for legacy logs, including source path, checksum, authority level, redaction, and current-state compatibility.
- Decide whether historical import belongs in the VS Code plugin MVP or remains post-MVP review work.
- Ensure imported logs cannot authorize task creation, file writes, checkpoint changes, or state transitions by themselves.

## ThinkIO Alignment

- Treats historical sources as evidence, not authority.
- Keeps legacy transcript import separate from live plugin interaction logging.

## Required Evidence

- `historical-chat-log-import-policy-reviewed`
- `legacy-transcript-authority-boundary-defined`
- `historical-log-import-decision-recorded`

## Completion Evidence

- `docs/historical-chat-log-import-policy.md` records that historical chat import is post-MVP evidence work.
- `kernel/plugin-view-contracts.ts` defines `HistoricalChatLogImportPolicy`.
- `tests/plugin-view-contracts.test.ts` verifies historical logs cannot create tasks, write files, change checkpoints, or mutate state.

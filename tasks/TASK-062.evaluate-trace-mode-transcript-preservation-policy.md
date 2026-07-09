# TASK-062: Evaluate Trace Mode Transcript Preservation Policy

Review whether ThinkIO needs transcript-grade preservation, gate-by-gate transcript capture, or an audit mode beyond normal execution/trace visibility.

Source report: `audit/v1.1.1-plugin-interaction-emulation-gap-report-2026-07-03.md`.

## Risk

Medium. v1.1.1 treats transcript-grade preservation as optional and request-driven, so this should not block the plugin MVP unless promoted.

## Subtasks

- Review the v1.1.1 trace mode and Option 3 transcript preservation rules.
- Decide whether plugin trace mode should expose compact governance visibility only or also capture transcript-grade evidence.
- Define triggers for transcript-grade preservation if it is promoted later.
- Keep audit mode separate from normal plugin chat/model interaction.

## ThinkIO Alignment

- Respects the v1.1.1 rule that transcript-grade preservation is not mandatory for normal continuity.
- Keeps deeper audit capture as an explicit review decision.

## Required Evidence

- `trace-mode-transcript-policy-reviewed`
- `audit-mode-candidate-scope-decided`
- `transcript-grade-preservation-trigger-defined`

## Completion Evidence

- `docs/trace-transcript-policy.md` defines execution, trace, and audit-candidate visibility.
- `kernel/plugin-view-contracts.ts` defines `TraceTranscriptPolicy`.
- `tests/plugin-view-contracts.test.ts` verifies transcript-grade preservation is optional, trigger-based, and not enabled by default.

# Trace And Transcript Preservation Policy

## Decision

ThinkIO should support normal execution visibility and trace visibility now. Transcript-grade preservation should stay optional and trigger-based.

This follows the v1.1.1 rule: full prompt/reply transcript preservation is useful for audit or reentry recovery, but it is not required for normal plugin interaction.

## Modes

### Execution Mode

Default mode.

Governance is active but compact. The plugin should show only the governance state needed for the current action.

### Trace Mode

Governance is visible.

The plugin may show:

- impact classification;
- origin/context source;
- governance decision;
- blockers;
- validation stage;
- follow-up command state.

Trace mode does not change the rules. It only makes them easier to see.

### Audit Mode Candidate

Audit mode is not part of the plugin MVP.

If promoted later, it may include:

- transcript-grade prompt/reply capture;
- gate-by-gate trace;
- registry checks;
- package/checksum verification;
- deeper continuity reconstruction evidence.

## Transcript-Grade Capture

Transcript-grade capture is off by default.

It may be enabled only when one of these triggers is explicit:

- user requests transcript-grade preservation;
- reentry validation requires it;
- continuity risk is high;
- audit review is active.

Normal interaction logs remain required. They record prompt/reply and command context as attached evidence, not canonical state.

## Boundary

Transcript-grade capture cannot:

- make chat canonical;
- authorize task creation;
- authorize file writes;
- change checkpoints;
- bypass governance decisions;
- replace validation.

## Task Evidence

This policy resolves TASK-062 evidence:

- `trace-mode-transcript-policy-reviewed`
- `audit-mode-candidate-scope-decided`
- `transcript-grade-preservation-trigger-defined`

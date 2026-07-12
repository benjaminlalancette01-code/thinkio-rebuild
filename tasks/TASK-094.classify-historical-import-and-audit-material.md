# TASK-094: Classify Historical Import And Audit Material

Define how ThinkIO should treat older audits, accepted imports, candidate imports, rejected imports, and reports that were accurate at the time but are no longer current.

## Purpose

The current state is hard to read because historical recovery material lives near active documentation. This task should preserve that material as evidence while preventing stale reports from being mistaken for current instructions.

## Scope

- Define audit/report disposition states.
- Define `imports/accepted`, `imports/candidates`, and `imports/rejected` authority.
- Add warning or index conventions for stale-but-useful reports.
- Link historical material from the current project navigation hub.
- Define runtime disposition rules for project material: current, canonical, generated, historical, imported, stale, rejected, and review-needed.
- Define which classified material feeds the project-state report.

## Required Evidence

- `historical-report-disposition-rules-defined`
- `imports-folder-authority-defined`
- `stale-report-warning-pattern-defined`
- `historical-material-navigation-updated`
- `material-reorganization-rules-defined`
- `project-state-report-inputs-classified`
## Completion

Completed on 2026-07-09 as part of the project material evaluation and navigation pass. Evidence is recorded in docs/project-material-evaluation-completion-report-2026-07-09.md.

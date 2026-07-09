# TASK-087: Evaluate Multi-Project Registry And Profile Model

Evaluate whether ThinkIO needs a multi-project registry after the local VS Code plugin is stable in one workspace.

## Why This Is Postponed

The current plugin target is workspace-first and activates from `thinkio.config.json`. Multi-project switching is part of the broader product vision, but it should not block the local plugin MVP.

## Candidate Scope If Promoted

- Project registry.
- Project profile.
- Project switcher.
- Per-project rules/provider profile.
- Archive/import status.
- Cross-project dependency policy.

## Required Evidence

- `workspace-first-boundary-reviewed`
- `project-profile-fields-evaluated`
- `multi-project-promotion-trigger-defined`
## Completion

Completed on 2026-07-09 as part of the product expansion boundary pass. The outcome is documented in docs/product-expansion-boundaries.md and validated by 	ests/product-expansion-boundaries.test.ts.


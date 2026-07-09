# TASK-047: Add Work Package Export Model For Bounded Model/App Handoff

Create explicit work packages before sending work to a model or third-party app.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

Medium-high. Context overload and vague handoff are core failure modes for ThinkIO.

## Subtasks

- Define work package records with target, mode, intent, expected output classes, sources, artifacts, rules, context cards, validation profile, and provider/app target.
- Track included and excluded sources.
- Validate package scope before export.
- Add export history and links back to active step or task.
- Add tests for bounded package creation and over-broad package blockers.

## Required Evidence

- `work-package-model-defined`
- `bounded-export-validation-added`
- `source-inclusion-exclusion-tracking-added`
- `work-package-tests-pass`

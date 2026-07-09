# TASK-037: Add Provider Adapter And Model Output Classifier Boundary

Add the runtime boundary that normalizes provider/app responses into ThinkIO output classes.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

High. Provider formatting must not redefine ThinkIO contract meaning.

## Subtasks

- Define provider adapter interface for model or app targets.
- Normalize provider request and response shape.
- Classify model/app outputs into approved output classes.
- Preserve warnings and unknown output states.
- Add tests using fixture outputs.

## Required Evidence

- `provider-adapter-interface-added`
- `output-classifier-added`
- `provider-output-normalization-tested`
- `provider-boundary-documented`

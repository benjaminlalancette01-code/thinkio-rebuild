# TASK-036: Add Model Input/Output Contract Schemas

Define the local contract for bounded model interaction.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

High. Without explicit contracts, model output can be misread as canonical state.

## Subtasks

- Define model input contract fields: intent, active target, context bundle, governance context, and expected output classes.
- Define model output contract fields: raw output, normalized output, output class, provider identity, warnings, and proposed actions.
- Define the output class vocabulary.
- Add schema validation for model contracts.
- Add tests for valid and invalid contract examples.

## Required Evidence

- `model-input-contract-schema-added`
- `model-output-contract-schema-added`
- `output-class-vocabulary-defined`
- `model-contract-tests-pass`

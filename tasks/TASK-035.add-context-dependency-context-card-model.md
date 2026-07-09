# TASK-035: Add Typed Context Dependency And Context Card Model

Make non-canonical project context explicit, attachable, and promotable.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

High. ThinkIO needs a way to keep rationale, friction, warnings, ideas, and references near work without making them canonical.

## Subtasks

- Define context dependency records for source, artifact, rule, task, step, and branch relationships.
- Define context cards with type, authority, relevance, attachment target, and relationship.
- Add promotion rules from context card to deferred item, task, rule, artifact, or review item.
- Update view projections where needed.
- Add tests for attachment and promotion constraints.

## Required Evidence

- `context-dependency-model-defined`
- `context-card-model-defined`
- `context-card-promotion-rules-added`
- `context-card-tests-pass`

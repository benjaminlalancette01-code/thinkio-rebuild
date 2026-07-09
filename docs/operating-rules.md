# Operating Rules

- Keep the rebuild small.
- Treat archive material as historical reference only.
- Do not load archive material by default.
- Do not duplicate authority across filetypes.
- Require evidence before promotion.
- Require explicit approval before full runtime activation.
- Use JSON state as operational truth.
- Use TypeScript only for enforceable behavior.
- When new tasks, ideas, or deferred items are added, run a task intake priority reorder review before continuing execution.

## Legacy Concept Import

Integrate by missing kernel capability only.

Use this path:

```text
old version file -> candidate concept -> mapped kernel capability -> rewritten new task -> schema/runtime/test -> accepted into rebuild
```

Never copy old folders into the rebuild.

Every imported concept must become one or more of:

- type
- schema
- runtime rule
- task
- test
- view projection
- BAML contract
- doc glossary entry

If a concept cannot become one of those, record it in `imports/rejected/` with a short reason.

## Integration Order

1. Task governance: phases, deferred items, task status, review gates, execution windows, approval boundaries.
2. Context governance: mode-specific context, allowed and blocked sources, archive boundaries, source authority, context packets.
3. Artifact governance: artifact chains, hashes, manifests, stale outputs, provenance, accepted versus exploratory material.
4. Checkpoint and replay: session continuity, resume state, safe handoff, accepted decisions, next valid step, replay validation.
5. Views: mind map, kanban, and dashboard projections after kernel data is solid.

Use one old concept per task. No broad migration.

## Task Intake And Priority Reorder

When ThinkIO adds new work, it must re-evaluate the open set instead of appending work to the end by habit.

The reorder pass must compare:

- candidate tasks;
- idea tasks;
- deferred items;
- dependencies;
- current project intent;
- current accepted runtime state;
- plugin-readiness blockers.

Promote an idea to candidate only when it blocks the current objective, protects canonical state, is required before local plugin validation can be trusted, is required before packaging/install validation, or resolves a dependency needed by an existing candidate.

Keep full-product ideas as ideas until plugin work proves they are needed.

The current workflow is documented in `docs/task-intake-priority-reorder-workflow.md`.

## Runtime Boundary Policy

- Workboard position is operational state, not task authority. A board can have only one current step.
- Parallel work must keep a branch record and return anchor before it leaves the current path.
- Mode policy decides which actions are legal before output can affect state.
- Frozen or executable work requires review-before-lock evidence.
- Provider/model output enters through model contracts, provider normalization, governance decision, and staged validation before any write is accepted.
- Context cards may explain, warn, or propose; they are not canonical until reviewed and promoted.
- General file changes use file action proposals and writer-boundary decisions; model output never writes directly.
- Work packages bound context before export, and provider output must return through intake/ingest records before promotion.
- Native board and mind-map views are runtime projections; `.devtool/features` remains a visual mirror.
- Chat sessions may attach to runtime records, but runtime records remain the source of truth.

## Interface Target

- The full app may eventually include a native chatbox for brainstorming, expansion, planning, review, and model handoff.
- The current product target is a working VS Code plugin, not the full standalone app.
- The VS Code plugin must wrap the existing ThinkIO runtime models before adding broad chat behavior.
- Any plugin chat or model panel must act through work packages, provider output ingest, governance decisions, and writer-boundary proposals.
- Chat UX is allowed as an interaction surface, but it must not become canonical project state.

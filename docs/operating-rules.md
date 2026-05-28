# Operating Rules

- Keep the rebuild small.
- Treat archive material as historical reference only.
- Do not load archive material by default.
- Do not duplicate authority across filetypes.
- Require evidence before promotion.
- Require explicit approval before full runtime activation.
- Use JSON state as operational truth.
- Use TypeScript only for enforceable behavior.

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

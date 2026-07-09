# Open Task Priority Review

Date: 2026-07-08

## Decision

The open work has been reordered around one target:

Make ThinkIO usable as a local VS Code plugin while preserving the governed runtime boundary.

One idea was promoted and completed:

- TASK-076 reviewed canonical runtime persistence beyond UI-only workspace state and documented the boundary required for plugin readiness.

Completed in this pass:

- TASK-083 repaired project graph coverage and validation.
- TASK-091 added the task intake priority reorder workflow.
- TASK-077 through TASK-082 completed the local VS Code plugin hardening path.

One dependency was corrected:

- TASK-083 no longer depends on TASK-077. Graph/projection repair was handled before Extension Host hardening.

## Candidate Execution Order

No active candidate tasks remain.

## Why This Order

The previous candidate sequence is complete. Future work should run the task intake reorder workflow before promoting any idea to candidate.

## Completed Idea Priority Order

The July 9 pass proceeded through this order and completed every listed idea as a boundary review.

High-priority ideas completed:

1. TASK-084: Evaluate user-facing rule policy model.
2. TASK-086: Evaluate provider registry and capability model.
3. TASK-088: Evaluate chat session and provider turn ingest model.
4. TASK-072: Evaluate remote model provider integration.

Medium-priority ideas completed:

5. TASK-085: Evaluate artifact disposition and quarantine model.
6. TASK-089: Evaluate project management and decision layer.
7. TASK-090: Evaluate runtime maturity ledger.
8. TASK-087: Evaluate multi-project registry and profile model.
9. TASK-074: Evaluate transcript-grade audit capture implementation.

Low-priority ideas completed:

10. TASK-075: Evaluate cross-machine plugin state sync.
11. TASK-070: Evaluate marketplace publishing metadata policy.
12. TASK-071: Evaluate signed release and installer polish.
13. TASK-073: Evaluate full standalone app chatbox.

## Result

All idea tasks from this review are now done/accepted.

The outcome is documented in `docs/product-expansion-boundaries.md`.

The current project state is documented in `docs/current-project-state-report-2026-07-09.md`.

## Bottom Line

Do not expand sideways without a new task intake priority review.

The completed hardening path was:

```text
Extension Host workflow
-> webview safety
-> live refresh
-> visible governance
-> local packaging
-> automated smoke harness
```

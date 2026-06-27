# TASK-008: Generate Kanban And Mindmap From Task Graph

## Candidate Concept

Views must be generated projections from governed task records and the project graph. They must not remain stale manual authority.

## Mapped Kernel Capability

View projection and local development runtime rule.

## Rewritten Into

- `kernel/view-projections.ts`
- `runtime/update-views.ts`
- `views/kanban.json`
- `views/mindmap.json`
- `views/dashboard.json`
- `tests/view-projections.test.ts`

## Legacy Source Referenced

None. This task reconciles existing rebuild state after TASK-003 through TASK-007.

## Acceptance

Accepted after local view projection tests and full validation pass.


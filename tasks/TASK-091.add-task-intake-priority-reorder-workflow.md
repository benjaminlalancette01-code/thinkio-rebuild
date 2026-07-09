# TASK-091: Add Task Intake Priority Reorder Workflow

Add a repeatable ThinkIO workflow for reordering candidates, ideas, and deferred items whenever new work is added.

## Why This Is Now

The project now has enough open candidate and idea work that task ordering cannot stay as manual cleanup.

When a new task is added, ThinkIO should review the whole open set against:

- current project intent;
- active objective;
- existing candidate tasks;
- idea tasks;
- deferred items;
- dependency order;
- plugin-readiness blockers;
- current accepted runtime state.

## Subtasks

- Define the required input sources for reorder review.
- Define when a task should be promoted from idea to candidate.
- Define when a candidate should stay candidate, move later, or be demoted back to idea.
- Define how deferred items participate without becoming hidden priority.
- Define how visual card `priority` and `order` fields are refreshed.
- Document the workflow in operating rules and plugin guide.
- Add or plan validation so future task additions cannot skip reorder review.

## ThinkIO Alignment

- Keeps task growth tied to current intent instead of chronological order.
- Keeps candidates focused on plugin readiness.
- Prevents idea tasks from drifting into execution without promotion reasoning.
- Preserves `.devtool/features` as a mirror while using task JSON as canonical state.

## Required Evidence

- `task-intake-reorder-rule-documented`
- `open-work-input-sources-defined`
- `promotion-demotion-criteria-defined`
- `candidate-idea-deferred-ordering-protocol-defined`
- `view-card-order-refresh-path-defined`

## Completion Evidence

- `docs/task-intake-priority-reorder-workflow.md` defines the standing reorder workflow, input sources, triggers, promotion tests, candidate ordering tests, idea ordering tests, deferred item handling, and visual card refresh rules.
- `docs/operating-rules.md` now requires task intake priority reorder review when new tasks, ideas, or deferred items are added.
- `scripts/validate-task-intake-order.ts` validates open task/card status alignment, priority vocabulary, and contiguous candidate/idea card ordering.
- `package.json` includes `validate:task-order` in `npm run check`.
- `tests/task-intake-order.test.ts` covers valid ordering and blocker detection.

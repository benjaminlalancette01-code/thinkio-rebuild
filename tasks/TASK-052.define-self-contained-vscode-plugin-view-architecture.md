# TASK-052: Define Self-Contained VS Code Plugin View Architecture

Define the common architecture for ThinkIO plugin views so Kanban, mind map, and interactive node diagram surfaces are native to the ThinkIO plugin.

## Risk

High. If views depend on external plugins, ThinkIO cannot provide a complete governed runtime shell on its own.

## Subtasks

- Define shared plugin view host responsibilities.
- Define common view-state fields such as selected record, collapsed groups, layout hints, zoom, pan, and refresh timestamp.
- Separate UI-only state from canonical runtime state.
- Document that external VS Code plugins may inspire UX but must not be runtime dependencies.
- Define how each view consumes runtime projections and commands.

## ThinkIO Alignment

- Views are projections, never authority.
- State mutations must go through runtime commands.
- Model handoff and file actions must pass through existing governance boundaries.

## Required Evidence

- `plugin-view-architecture-defined`
- `no-external-plugin-dependency-rule-added`
- `shared-view-state-contract-defined`
- `plugin-view-architecture-tests-pass`

## Completion Evidence

- `kernel/plugin-view-contracts.ts` defines the shared plugin view architecture contract.
- `docs/thinkio-full-spec-sheet.md` documents the view architecture and no-external-plugin rule.
- `tests/plugin-view-contracts.test.ts` validates required views, shared view state, and command routes.

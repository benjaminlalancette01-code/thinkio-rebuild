# TASK-120: Implement Native Session Grounding And Next-Action Resolver

Create the native replacement for old session reentry and project-support routing.

## Required Work

- Define a session-grounding record that combines project identity, current task, checkpoint, approval, blockers, generated view freshness, worktree state, and mode.
- Implement a deterministic next-action resolver.
- Expose the result through a runtime command and VS Code command surface.
- Add tests proving deferred or historical work cannot outrank active governed work without evidence.

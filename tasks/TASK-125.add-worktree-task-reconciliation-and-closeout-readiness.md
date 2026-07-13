# TASK-125: Add Worktree-Task Reconciliation And Closeout Readiness

Make dirty-worktree interpretation native instead of relying on Codex to infer whether changes match the active task.

## Required Work

- Summarize Git worktree state in a structured record.
- Compare changed files against active task allowed/blocked context.
- Block or warn on closeout when changes do not match task scope.
- Surface reconciliation results in start/resume and closeout workflows.

# Kanban Markdown Sync Boundary

Kanban Markdown cards in `.devtool/features/` are visual mirrors. Canonical task state lives in `tasks/*.json`.

For now, card movement or card frontmatter edits must not be treated as authoritative task mutation. Runtime view generation reads the governed task JSON files and writes `views/kanban.json`, `views/mindmap.json`, and `views/dashboard.json`.

If ThinkIO later needs two-way Kanban sync, it should be implemented as a guarded runtime command with schema validation, transition checks, approval handling for authority-affecting changes, and a rollback path.

# TASK-110: Implement Native Task Kanban Webview Presentation

Replace the current Task Kanban raw projection display with a ThinkIO-native board UI.

## Required Work

- Render lanes from `views/kanban.json`.
- Render task cards with title, id, status, authority, dependencies, blockers, and evidence signals.
- Add buttons for selecting, opening, adding proposals, saving proposals, deferring, and requesting approval where supported.
- Keep all mutations proposal-first and routed through the runtime bridge.


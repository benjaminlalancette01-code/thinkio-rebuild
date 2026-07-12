# TASK-115: Add Webview UI Stress And Visual Smoke Validation

Add validation that catches broken or empty ThinkIO plugin views before the plugin is treated as locally usable.

## Required Work

- Add render smoke checks for each webview.
- Assert that each view renders view-specific UI, not only raw JSON.
- Add large projection render checks for Kanban, Project Navigation, Mind Map, and Runtime Node Diagram.
- Define the report workflow for visual/webview stress findings.


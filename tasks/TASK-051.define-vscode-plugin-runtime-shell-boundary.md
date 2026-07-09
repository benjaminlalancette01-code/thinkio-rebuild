# TASK-051: Define VS Code Plugin Runtime Shell Boundary

Capture the product direction that ThinkIO should become a working VS Code plugin before a full standalone app with a native chatbox.

## Risk

High. If the plugin starts as a general chat UI, ThinkIO can lose the runtime-governed boundary that makes it distinct from a model client.

## Subtasks

- Define the VS Code plugin as the current product shell.
- Defer the full-app chatbox while preserving it as a future interaction surface.
- Define the plugin MVP surfaces: workboard, context panel, model handoff panel, proposal review, and governed writer commands.
- Ensure model interaction goes through work packages, provider ingest, governance decisions, validation stages, and file action proposals.
- Record that chat sessions may attach to runtime records but cannot become canonical state.

## Required Evidence

- `vscode-plugin-target-recorded`
- `full-app-chatbox-deferred`
- `plugin-runtime-shell-boundary-defined`
- `plugin-mvp-surface-plan-added`

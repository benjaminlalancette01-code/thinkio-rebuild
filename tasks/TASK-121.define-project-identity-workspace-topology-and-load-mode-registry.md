# TASK-121: Define Project Identity, Workspace Topology, And Load-Mode Registry

Create one native project identity and load-mode surface so ThinkIO no longer depends on scattered historical meta files.

## Required Work

- Define project identity, workspace root, archive root, extension root, and generated-output boundaries.
- Define load modes such as canonical, generated, historical, archive-evidence, external-report, and working-scratch.
- Validate project identity and topology during startup/check.
- Generate a projection usable by the plugin and current-state reports.

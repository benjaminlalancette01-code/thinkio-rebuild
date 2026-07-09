# VS Code Plugin View Roadmap

ThinkIO's VS Code plugin must provide its own core visual surfaces. It must not depend on external Kanban, mind-map, or node-diagram plugins for the MVP.

The plugin should expose at least three native views:

- Task Kanban view for governed task and workboard state.
- Artifact mind-map view for artifact/source/context relationships, like a second-brain graph.
- Interactive node diagram view for runtime flow, validation, handoff, and dependency paths.

All three views must read from ThinkIO runtime projections and commands. They are UI projections, not sources of truth.

## Shared Alignment Rules

- Canonical state remains in governed task JSON, runtime state JSON, ledger/checkpoint records, and kernel/runtime models.
- View state may store UI-only details such as zoom, pan, collapsed groups, selected node, or local layout hints.
- State mutations must go through runtime commands.
- View state must not define task status, authority, evidence, checkpoint validity, or write permission.
- Model and file-write interactions from any view must route through work packages, provider output ingest, governance decisions, validation stages, and writer-boundary proposals.
- The plugin must bundle or implement its own view rendering. External plugins may inspire UX patterns, but cannot be required at runtime.

## Candidate Task Split

1. TASK-052 defines the shared self-contained plugin view architecture.
2. TASK-053 implements the native task Kanban view.
3. TASK-054 implements the artifact mind-map second-brain view.
4. TASK-055 implements the interactive node diagram runtime-flow view.
5. TASK-056 defines the plugin command/data bridge used by all views.
6. TASK-057 defines cross-view selection, sync, and governed interaction commands such as switch mode, add task, save task, defer work, open proposal review, and request approval.
7. TASK-058 validates that the plugin MVP is self-contained and does not rely on other VS Code plugins.
8. TASK-059 defines the plugin interaction log boundary.
9. TASK-060 defines chat-to-task proposal creation and save/review commands.
10. TASK-061 defines the plugin runtime composer/result surface.
11. TASK-062 reviews optional trace-mode transcript preservation.
12. TASK-063 reviews historical chat log import policy.
13. TASK-064 scaffolds the VS Code extension manifest and activation boundary.
14. TASK-065 implements the VS Code command adapter and runtime bridge.
15. TASK-066 implements native VS Code webview providers for the core views.
16. TASK-067 implements the runtime composer and proposal review plugin panels.
17. TASK-068 adds plugin workspace state persistence.
18. TASK-069 adds extension packaging and smoke validation.

## MVP Dependency Shape

```text
TASK-051
  -> TASK-052
      -> TASK-056
      -> TASK-053
      -> TASK-054
      -> TASK-055
          -> TASK-057
          -> TASK-058
```

TASK-053, TASK-054, and TASK-055 are the required minimum view set. TASK-056 is the shared bridge that lets them call ThinkIO runtime safely. TASK-057 keeps interaction consistent across views. TASK-058 protects the no-external-plugin-dependency requirement.

TASK-059, TASK-060, and TASK-061 extend the plugin from passive views into governed model interaction. They keep prompts/replies as attached interaction logs, route new task creation through proposals, and render model output as runtime composer/result state instead of a generic chatbot transcript. TASK-062 and TASK-063 are review ideas for optional transcript-grade preservation and historical log import.

TASK-064 through TASK-069 are the implementation bridge from architecture to usable VS Code plugin. They should be resolved before ThinkIO is treated as installable plugin software.

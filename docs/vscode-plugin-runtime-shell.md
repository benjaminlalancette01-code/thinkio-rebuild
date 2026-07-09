# VS Code Plugin Runtime Shell Boundary

The current product shell for ThinkIO is a VS Code plugin. The full standalone app can come later.

The plugin must expose ThinkIO runtime truth through views and commands, not through an independent chat-first surface. A model panel may exist inside the plugin, but it must call the runtime through governed records.

## Plugin MVP Surfaces

- Workboard view: current step, queued next, deferred, resolved, and idea/intake work.
- Context panel: selected task, active step, branch, artifact links, context cards, and allowed/blocked context.
- Model handoff panel: bounded work package creation and provider target selection.
- Proposal review panel: draft, proposal, blocked, approval-required, validated, ingested, and rejected output states.
- Governed writer commands: apply only approved file action proposals through the writer boundary.

The plugin must also provide its own task Kanban, artifact mind-map, and interactive runtime node diagram views. The detailed view roadmap lives in `docs/vscode-plugin-view-roadmap.md`.

## Model Boundary

All plugin model interaction must flow through:

```text
selected runtime context
-> active work slice
-> work package
-> provider/model output
-> provider output ingest
-> governance decision
-> validation stages
-> context card, deferred item, task, file action proposal, rejected record, or approved mutation path
```

The plugin must not let model output write files directly.

## Chat Boundary

The full app may eventually include a native chatbox for brainstorming, expansion, planning, and review. For the VS Code plugin MVP, chat-like interaction is allowed only as an attached runtime surface.

Chat sessions may attach to runtime records. Chat sessions are not canonical state.

## Plugin Interaction Log Boundary

The plugin may keep an interaction log for prompts, replies, selected context slices, command intents, result references, and follow-up actions. That log is evidence/context only.

The interaction log must remain separate from:

- canonical event history;
- process ledger records;
- task JSON/card state;
- UI layout state;
- provider adapter convenience logs;
- transcript-grade audit captures.

Transcript-grade preservation is optional review/audit behavior, not the default MVP chat model.

## Plugin Runtime Composer Boundary

The plugin model surface should behave as a governed runtime composer/result surface:

```text
selected context
-> composer instruction
-> runtime command
-> model/provider result
-> result state
-> follow-up action
```

It must not behave as a generic chatbot transcript. New task creation from this surface must create a task proposal first, then route save/promote through governance, validation, and approved mutation boundaries.

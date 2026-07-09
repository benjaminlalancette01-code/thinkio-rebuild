# ThinkIO Full Spec Sheet

## 1. Product Definition

ThinkIO is a governed work/runtime layer for AI-assisted project execution.

It sits above models and tools. The user does not interact with a model as a loose chat transcript. The user works through ThinkIO context, commands, runtime state, validation, and proposals. Model output returns to ThinkIO as classified, reviewable material.

The first product shell is a VS Code plugin. A full standalone app can come later.

## 2. Core Principle

ThinkIO separates:

- conversation from state;
- proposals from mutations;
- projections from authority;
- model output from accepted work;
- UI layout from runtime truth;
- historical evidence from current authority.

Nothing becomes canonical just because it appears in chat, a model response, a visual card, a graph node, or a generated artifact.

## 3. Canonical State

Canonical state currently lives in:

- governed task JSON;
- runtime state JSON;
- checkpoints;
- approvals;
- artifact-chain records;
- ledger/process records;
- mutation transaction records;
- validation records.

Canonical task files use the governed task schema:

- `id`
- `title`
- `mode`
- `status`
- `authority`
- `dependencies`
- `allowedContext`
- `blockedContext`
- `requiredEvidence`
- `promotionRule`
- `checkpointRequired`

## 4. Authority Model

ThinkIO uses authority levels to control what a record can do:

- `idea`
- `candidate`
- `accepted`
- `frozen`
- `executable`
- `final`
- `rejected`
- `archived`

Authority is separate from task status. A task status change does not automatically grant authority. Authority-changing actions must pass through validation, evidence, and approval where required.

## 5. Task Status Model

Task statuses are:

- `idea`
- `candidate`
- `accepted`
- `frozen`
- `executable`
- `done`
- `rejected`
- `archived`

Task status is the lifecycle position. Authority is the permission level. The two must remain compatible.

## 6. Modes

ThinkIO modes are:

- `brainstorm`
- `plan`
- `build`
- `review`
- `freeze`
- `execute`

Mode determines which actions are allowed, how strict validation should be, and whether material can be preserved as ideas, proposals, review-required records, or canonical changes.

## 7. Workboard Model

The workboard gives tasks an operational position without rewriting task authority.

Workflow positions are:

- `current`
- `queued-next`
- `deferred`
- `resolved`
- `idea-intake`

Workboard steps can link to tasks, parent steps, artifacts, and branches.

## 8. Branch And Return Model

ThinkIO supports parallel work through branches and return anchors.

A branch has:

- purpose;
- status;
- parent step;
- optional active step;
- success condition;
- history.

A return anchor defines how paused or parallel work comes back into the main flow.

## 9. Context Model

Context is explicit.

Allowed context defines what ThinkIO may use. Blocked context defines what it must avoid. Context cards can attach rationale, warnings, friction, ideas, and references to tasks, steps, artifacts, rules, or branches.

Context cards are non-canonical until reviewed and promoted.

## 10. Model Interaction Model

The model interaction flow is:

```text
selected runtime context
-> active work slice
-> work package
-> model/provider output
-> provider output ingest
-> governance decision
-> validation stages
-> disposition
```

Allowed dispositions include:

- context card;
- deferred item;
- task;
- file action proposal;
- rejected record;
- approved mutation path.

Model output cannot write files directly.

## 11. Work Packages

A work package is the bounded handoff from ThinkIO to a model, app, or human review target.

It contains:

- target;
- mode;
- intent;
- expected output classes;
- sources;
- excluded sources;
- artifacts;
- rules;
- context card IDs;
- validation profile;
- provider target;
- optional task and step IDs.

## 12. Provider Output Ingest

Provider output is normalized and classified before ThinkIO uses it.

Output classes include:

- informational;
- hypothesis;
- recommendation;
- conflict signal;
- correction candidate;
- upgrade candidate;
- file action proposal;
- rejected;
- unknown.

Every provider output must preserve source identity, warnings, proposed actions, validation run links, and final disposition.

## 13. Governance Decision Engine

Governance decisions classify an action by:

- action type;
- sensitivity;
- outcome;
- blockers;
- allowed next actions.

Outcomes are:

- allow;
- approval required;
- block;
- defer.

## 14. Validation Loop

Validation stages are:

- pre-export;
- post-export;
- post-provider;
- pre-ingest;
- post-ingest.

Validation can block, defer, or permit follow-up action. Views should refresh only after the relevant validation path is clean.

## 15. Writer Boundary

File writes must go through file action proposals and writer-boundary decisions.

A file action proposal includes:

- task ID;
- action;
- path;
- optional target path;
- rationale;
- risk;
- approval requirement;
- checkpoint or rollback anchor where relevant.

Model output cannot bypass this boundary.

## 16. Mutation Transaction Model

Canonical mutations are planned and applied as mutation transactions.

A transaction records:

- task ID;
- from/to status;
- from/to authority;
- evidence;
- ledger artifact IDs;
- checkpoint ID;
- rollback state;
- creation time.

This protects ThinkIO from silent state changes.

## 17. Runtime Readiness

Runtime readiness proves that required state, schemas, branches, transactions, and validation paths are in a coherent state before runtime work proceeds.

Readiness is not assumed. It is checked.

## 18. Replay And Reconstruction

Replay validation confirms that accepted state can be reconstructed from:

- tasks;
- state files;
- checkpoints;
- accepted artifacts;
- artifact chains;
- project graph nodes.

This is the continuity safety net.

## 19. VS Code Plugin MVP

The VS Code plugin is the first product shell.

It must provide native ThinkIO views without relying on external Kanban, mind-map, graph, flowchart, or node-diagram plugins.

Required native views:

- task Kanban;
- artifact mind-map;
- interactive runtime node diagram;
- context panel;
- proposal review;
- runtime composer/result surface.

## 20. Plugin View Architecture

Plugin views are projections. They are not authority.

Shared view state may include:

- selected record;
- collapsed groups;
- layout hints;
- zoom;
- pan;
- refresh timestamp.

This state is UI-only. It cannot define task status, authority, checkpoint validity, evidence, or write permission.

## 21. Task Kanban Plugin View

The Kanban view shows governed tasks and workboard lanes.

It must show:

- current work;
- queued next work;
- deferred work;
- resolved work;
- idea/intake work;
- task status groupings where useful;
- authority;
- blockers;
- dependencies;
- friction markers;
- validation status.

Card movement must route through runtime commands. Drag/drop is a proposal unless governance allows the change.

## 22. Artifact Mind-Map Plugin View

The mind-map view shows artifact and context relationships.

Node kinds include:

- task;
- step;
- source;
- artifact;
- rule;
- context card;
- branch;
- work package;
- provider output;
- derivation;
- friction;
- validation run.

Edge kinds include:

- depends-on;
- derived-from;
- validates;
- blocks;
- attached-to;
- exports-to;
- ingests-from;
- promotes-to.

## 23. Runtime Node Diagram Plugin View

The runtime node diagram shows execution and governance flow.

It supports:

- selection;
- focus path;
- expand/collapse;
- blocker inspection.

Geometry and layout are metadata only. They cannot become runtime authority.

## 24. Plugin Command Bridge

Plugin commands must route through ThinkIO runtime boundaries.

Core commands include:

- refresh view;
- select record;
- open record;
- switch mode;
- add task proposal;
- save task proposal;
- create work package;
- ingest provider output;
- request approval;
- defer work;
- reject proposal;
- apply approved proposal;
- open proposal review;
- record interaction;
- submit runtime composer input.

Commands that mutate canonical state require approval and validated mutation paths.

## 25. Interaction Log

The plugin may keep an interaction log for:

- prompts;
- replies;
- command intents;
- result references;
- follow-up actions.

Interaction logs must attach to runtime records. They are evidence/context only. They are not canonical event history and cannot mutate state.

Transcript-grade preservation is optional and should be controlled by trace/audit policy.

## 26. Runtime Composer

The runtime composer is the plugin's model interaction entry point.

It is not a generic chat transcript.

It must show:

- selected context;
- composer input;
- result state;
- governance state;
- follow-up commands;
- interaction log references.

Result states include:

- empty;
- proposal;
- approval required;
- blocked;
- approved;
- applied;
- rejected;
- deferred pending write.

## 27. Chat-To-Task Proposal Pipeline

When a user chats with ThinkIO to create a task, ThinkIO gathers missing task information first.

Required fields:

- title;
- mode;
- priority;
- dependencies;
- allowed context;
- blocked context;
- required evidence;
- source interaction log.

The output is a task proposal. It becomes canonical task JSON only after review, validation, and approved mutation/write handling.

## 28. Self-Contained Plugin Bundle

The plugin bundle must include:

- task Kanban assets;
- artifact mind-map assets;
- runtime node diagram assets;
- command handlers;
- data providers;
- composer/result surface.

It must not require external VS Code plugins for the core visual surfaces.

## 29. Current Implementation Assets

Core implementation assets:

- `kernel/plugin-view-contracts.ts`
- `kernel/runtime-projections.ts`
- `kernel/interaction-surface.ts`
- `kernel/intake-pipeline.ts`
- `kernel/provider-output-ingest.ts`
- `kernel/governance-decision.ts`
- `kernel/mutation-transaction.ts`
- `runtime/command-registry.ts`
- `runtime/local-dev-runtime.ts`

Primary plugin planning docs:

- `docs/vscode-plugin-runtime-shell.md`
- `docs/vscode-plugin-view-roadmap.md`
- `docs/current-project-state-report-2026-07-04.md`

## 30. Non-Goals For The MVP

The MVP should not:

- depend on external view plugins;
- make chat canonical state;
- preserve full transcript-grade logs by default;
- allow model output to write files directly;
- let visual layout metadata become authority;
- import historical logs as authority;
- activate old runtime files from archive material.

## 31. Next Build Target

The next build target is the real VS Code extension shell:

1. extension manifest;
2. command registration;
3. webview/data-provider wiring;
4. native Kanban rendering;
5. native mind-map rendering;
6. runtime node diagram rendering;
7. runtime composer/result rendering;
8. local smoke test.

The governing boundaries are now defined enough to start that implementation cleanly.

## 32. Plugin Readiness Status

As of 2026-07-04, ThinkIO is ready as a governed VS Code plugin architecture, but not yet ready as an installable VS Code plugin.

The remaining plugin-readiness tasks are:

- TASK-064: scaffold extension manifest and activation boundary;
- TASK-065: implement VS Code command adapter and runtime bridge;
- TASK-066: implement native webview providers for core views;
- TASK-067: implement runtime composer and proposal review panels;
- TASK-068: add plugin workspace state persistence;
- TASK-069: add extension packaging and smoke validation.

These tasks are required before ThinkIO can be used as a true VS Code plugin.

## 33. Local Plugin Hardening Phase

After TASK-064 through TASK-069, ThinkIO had a first local extension shell.

TASK-076 through TASK-083 and TASK-091 completed the local plugin hardening phase:

- TASK-083: project graph coverage and validation repair;
- TASK-091: task intake priority reorder workflow;
- TASK-077: extension host launch and manual smoke workflow;
- TASK-078: webview message protocol and CSP hardening;
- TASK-079: live projection refresh and file watchers;
- TASK-080: governance result and blocker rendering in plugin UI;
- TASK-076: canonical runtime persistence beyond plugin UI state;
- TASK-081: local VSIX packaging and install validation;
- TASK-082: automated extension host smoke harness.

The July 9 product expansion pass completed the remaining idea tasks as explicit future-product boundaries.

## 34. Design Recovery Comparison

The July 8, 2026 design recovery comparison reviewed three pre-rebuild reports against the current project.

The result:

- the VS Code plugin shell and core interaction boundary are already substantially recovered;
- graph/projection state drift has been repaired by TASK-083;
- canonical runtime persistence was reviewed before local packaging;
- broader recovered-design items now have explicit product expansion boundaries.

Completed recovered-design boundary reviews:

- TASK-084: user-facing rule policy model;
- TASK-085: artifact disposition and quarantine model;
- TASK-086: provider registry and capability model;
- TASK-087: multi-project registry and profile model;
- TASK-088: chat session and provider turn ingest model;
- TASK-089: project management and decision layer;
- TASK-090: runtime maturity ledger.

Full report: `docs/design-recovery-comparison-vscode-plugin-gap-report-2026-07-08.md`.
Boundary report: `docs/product-expansion-boundaries.md`.

## 35. Task Intake Reorder Rule

When new tasks, ideas, or deferred items are added, ThinkIO must run a task intake priority reorder review.

The review compares current candidates, ideas, deferred items, dependencies, current objective, and plugin-readiness blockers.

The reorder rule protects the project from chronological drift. New work is placed by objective and dependency, not by creation time.

Current workflow: `docs/task-intake-priority-reorder-workflow.md`.

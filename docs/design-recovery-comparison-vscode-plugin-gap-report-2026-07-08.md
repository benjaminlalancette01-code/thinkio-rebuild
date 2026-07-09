# Design Recovery Comparison And VS Code Plugin Gap Report

Date: 2026-07-08

## Executive Verdict

The three pre-rebuild comparison reports are directionally correct, but some of their gaps have already been addressed in the current rebuild.

The current project is no longer just a runtime sketch. It now has a local VS Code extension shell, native plugin view assets, command routing, interaction logs, runtime composer/proposal panels, workspace state helpers, provider ingest, governance decisions, validation stages, and candidate hardening tasks.

The most important conclusion still holds:

ThinkIO should remain a governed project layer above models, not a generic chat app, not a workflow builder clone, and not a model-specific adapter.

For the current goal, the right move is:

1. Finish the local VS Code plugin hardening path.
2. Fix current task graph/projection drift.
3. Broader recovered-design gaps were later completed as boundary reviews in the July 9 product expansion pass.

## Reports Compared

External reports reviewed:

- `C:\Users\benja\Downloads\ThinkIO_vs_Visual_Ideas_Architectural_Comparison.md`
- `C:\Users\benja\Downloads\thinkio_rebuild_deep_missing_design_audit.md`
- `C:\Users\benja\Downloads\thinkio_rebuild_design_recovery_audit_v2.md`

Current rebuild evidence reviewed:

- `tasks/TASK-001` through `TASK-082`
- `package.json`
- `extension/`
- `media/`
- `kernel/`
- `runtime/`
- `schemas/`
- `state/project.graph.json`
- `views/mindmap.json`
- `docs/thinkio-vscode-plugin-guide.md`
- `audit/vscode-plugin-maturity-audit-2026-07-04.md`
- `docs/current-project-state-report-2026-07-04.md`
- `docs/thinkio-full-spec-sheet.md`

## Current Project State

ThinkIO currently has:

- governed task JSON as canonical task state;
- CUE schema validation;
- TypeScript kernel/runtime validation;
- state transition and authority controls;
- approval, mutation, checkpoint, replay, and artifact-chain boundaries;
- model input/output contracts;
- provider normalization and provider output ingest;
- work package export;
- native task Kanban, artifact mind-map, and runtime node diagram contracts;
- VS Code extension manifest contribution metadata;
- activation entrypoint;
- command bridge;
- webview providers;
- runtime composer and proposal review panels;
- workspace-state persistence helpers;
- extension package validation;
- local plugin guide.

Current task state:

- TASK-001 through TASK-069 are done/accepted.
- TASK-070 through TASK-075 are done/accepted.
- TASK-076 is done/accepted.
- TASK-083 and TASK-091 are done/accepted.
- TASK-077 through TASK-082 are done/accepted.
- TASK-084 through TASK-090 are done/accepted.

## Where The External Reports Were Already Resolved

### VS Code Plugin Shell

The older reports expected the plugin shell to be missing. That is no longer true.

Resolved by:

- TASK-064: extension manifest and activation boundary.
- TASK-065: VS Code command adapter and runtime bridge.
- TASK-066: native webview providers for core views.
- TASK-067: runtime composer and proposal review panels.
- TASK-068: workspace state persistence.
- TASK-069: extension packaging and smoke validation.

Current status: implemented enough for local hardening, not marketplace-ready.

### Required Native Views

The reports called out the need for ThinkIO-owned views instead of depending on other plugins. The current rebuild already has this direction.

Present views:

- task Kanban;
- artifact mind-map;
- runtime node diagram;
- context panel;
- proposal review;
- runtime composer.

Current status: architecture, first extension shell, Extension Host workflow, live refresh, governance rendering, VSIX packaging, and automated smoke coverage are present for local use.

### User To ThinkIO To Model Boundary

The reports warned that the user should not interact with the model directly as loose chat.

The rebuild now has:

- `kernel/interaction-surface.ts`;
- runtime composer surface contract;
- interaction log boundary;
- chat-to-task proposal pipeline;
- provider output ingest;
- governance decision engine;
- file-action proposal boundary.

Current status: conceptually strong and locally hardened through TASK-077 through TASK-082.

### Historical Chat And Transcript Policy

The reports called for chat logging behavior and import discipline.

The rebuild now has:

- TASK-059 plugin interaction log boundary;
- TASK-060 chat-to-task proposal pipeline;
- TASK-062 trace/transcript policy;
- TASK-063 historical chat log import policy.

Current status: policy and contracts exist. Full transcript-grade capture remains intentionally postponed as TASK-074.

### Provider Output As Governed Input

The reports warned that GPT should not be special.

The rebuild now has:

- `kernel/provider-boundary.ts`;
- `kernel/provider-output-ingest.ts`;
- model contracts;
- work packages;
- provider output classifications and dispositions.

Current status: provider boundary exists. A full provider registry/capability model is not required for the current local plugin MVP.

## Current Issues That Should Be Addressed Now

### 1. Project Graph State Drift

Resolved by TASK-083.

`state/project.graph.json` is rebuilt from canonical task files during `npm run update:views`, and graph validation now detects missing task nodes or dependency edges.

Why this matters:

- the artifact mind-map and runtime diagram depend on graph/projection trust;
- the plugin should not harden against stale project state;
- the old reports specifically warned about source-of-truth drift and project-centered state.

Required outcome:

- project graph covers all current governed tasks;
- graph validation detects missing task nodes and missing dependency edges;
- view generation cannot silently mask stale graph state;
- docs clarify that `state/project.graph.json` is generated support state, not the canonical task source.

### 2. Finish The Current VS Code Hardening Path

The correct immediate sequence remains:

The local hardening sequence through TASK-082 is complete. Promote future work only through the task intake reorder workflow.

Those tasks are complete. Future promotion should use the task intake reorder workflow.

## Missing Components That Should Be Postponed

These gaps are real, but they should not interrupt the current local plugin hardening path.

### User-Facing Rule Policy

The reports are right that ThinkIO needs explicit locked/default/opt-in/opt-out/custom rules.

Current status:

- operating rules exist in docs;
- mode policy exists in runtime;
- work packages carry rules;
- first-class rule policy tiers and conflict detection now exist in `kernel/product-expansion-boundaries.ts`.

Decision:

- completed as boundary task TASK-084.

Future promotion trigger:

- TASK-080 needs user-visible blocker explanations that require rule identity;
- provider integration needs provider-specific rule overlays;
- users need to enable/disable project rules inside the plugin.

### Artifact Disposition And Quarantine

The reports are right that quarantine, supersession, stale, provisional, and historical-reference states should become explicit.

Current status:

- artifact chains detect stale artifacts;
- provider outputs have final dispositions;
- unified artifact disposition vocabulary now exists in `kernel/product-expansion-boundaries.ts`.

Decision:

- completed as boundary task TASK-085.

Future promotion trigger:

- proposal review needs quarantine/supersede actions;
- archive import starts producing recoverable artifacts;
- stale artifact invalidation needs to affect plugin views.

### Provider Registry And Capability Model

The reports are right that ThinkIO should eventually model GPT, Codex, Claude, local models, and other tools as provider identities with capabilities.

Current status:

- provider identity and output ingest exist;
- remote provider integration is already idea task TASK-072;
- provider capability profiles and trust/secret boundaries now exist in `kernel/product-expansion-boundaries.ts`.

Decision:

- completed as boundary task TASK-086.

Future promotion trigger:

- TASK-072 is promoted;
- the composer needs real provider selection;
- capability differences need to affect context packets or rule overlays.

### Multi-Project Registry

The reports are right that full ThinkIO eventually needs project profiles and project switching.

Current status:

- the plugin is workspace-first;
- activation is tied to `thinkio.config.json`;
- a multi-project registry boundary exists, while cross-project dependencies remain blocked.

Decision:

- completed as boundary task TASK-087.

Future promotion trigger:

- the local plugin works reliably in one workspace;
- users need project switching inside one VS Code session;
- cross-project dependency tracking becomes necessary.

### Chat Session And Provider Turn Ingest

The reports are right that a full chat/session model needs chat turns, provider calls, context snapshots, redaction, and ingest reviews.

Current status:

- interaction logs and chat-to-task proposal contracts exist;
- historical chat import policy exists;
- chat session, turn, and provider call records now exist as a boundary model.

Decision:

- completed as boundary task TASK-088.

Future promotion trigger:

- runtime composer starts calling real providers;
- audit mode needs structured provider-call records;
- historical transcript import becomes active work.

### Project Management And Decision Layer

The reports are right that ThinkIO eventually needs milestones, decisions, risks, requirements, and release planning.

Current status:

- governed tasks, workboard, process ledger, and project graph exist;
- project decision, milestone, risk, requirement, and release record boundaries now exist.

Decision:

- completed as boundary task TASK-089.

Future promotion trigger:

- the plugin needs a project dashboard beyond task Kanban;
- release planning starts;
- decision records become necessary for project continuity.

### Canonical Runtime Persistence

The persistence boundary was previously listed as a future idea. It was promoted and completed as TASK-076 because the plugin shell has save/apply command routes and workspace UI state.

Current status:

- mutation transactions exist;
- plugin workspace state exists;
- command routes distinguish proposal and mutation behavior;
- the plugin-readiness impact of canonical persistence is documented in `docs/canonical-runtime-persistence-boundary.md`.

Decision:

- complete as TASK-076.

### Runtime Maturity Ledger

The reports are right that ThinkIO needs a way to tell design-only features from tested, UI-exposed, production-ready features.

Current status:

- task status and authority exist;
- docs describe plugin maturity;
- structured maturity stage taxonomy now exists.

Decision:

- completed as boundary task TASK-090.

Future promotion trigger:

- multiple subsystems are partly implemented and hard to classify;
- release packaging needs a maturity gate;
- user-facing docs need generated maturity status.

## Comparison Matrix

| Report Concern | Current Status | Decision |
|---|---|---|
| Project must be the center | Addressed for local plugin use; graph/projections are regenerated and validated | Complete through TASK-083 |
| AI interaction layer | Addressed as contracts, composer/proposal shell, command routing, and governed UI feedback | Complete through TASK-077 to TASK-082 |
| Missing project memory | Addressed through ledger, checkpoints, artifacts, tasks, and decision record boundary | Complete through TASK-089 |
| Rule system | Rule policy boundary exists with tiers and conflict detection | Complete through TASK-084 |
| Broader UI surfaces | MVP views exist and local plugin hardening is complete; extra surfaces should wait | Keep future UI surfaces behind new intake review |
| Chat/session ingestion lifecycle | Interaction logs, proposal pipeline, session, turn, and provider-call boundaries exist | Complete through TASK-088 |
| Quarantine/supersession | Unified disposition vocabulary exists | Complete through TASK-085 |
| Provider registry | Provider capability registry boundary exists | Complete through TASK-086 |
| Archive recovery/provenance | Policies exist, broad recovery pipeline is not MVP | Postpone unless needed by import work |
| Canonical runtime persistence | UI state exists; mutation commands exist; plugin persistence boundary is documented | Complete through TASK-076 |
| Project switching | Workspace-first runtime plus future registry boundary exists | Complete through TASK-087 |
| Runtime maturity tracking | Maturity taxonomy and ledger boundary exist | Complete through TASK-090 |

## Recommended Next Work

Do now:

No active candidate task remains from this report.

Completed as boundary reviews:

- TASK-084 user-facing rule policy;
- TASK-085 artifact disposition/quarantine;
- TASK-086 provider registry/capability model;
- TASK-087 multi-project registry;
- TASK-088 chat session/provider turn ingest;
- TASK-089 project management/decision layer;
- TASK-090 runtime maturity ledger.

## Bottom Line

The external reports are useful, but the current rebuild has already recovered much of the VS Code plugin and governance foundation they worried about.

The project should not detour into full product expansion yet.

The immediate plugin path is clear:

- use the completed local VS Code Extension Host hardening path;
- expose governance blockers clearly in the plugin;
- only promote the larger recovered-design ideas when the working plugin proves they are needed.

# VS Code Plugin Implementation Plan: TASK-064 To TASK-069

Date: 2026-07-04

## Purpose

This plan expands the next six plugin-readiness tasks before execution.

The key decision is already made: ThinkIO is architecturally ready for a VS Code plugin, but it is not yet a usable plugin. TASK-064 through TASK-069 are the bridge from governed architecture to installable extension.

## Execution Order

1. TASK-064: scaffold the extension manifest and activation boundary.
2. TASK-065: implement VS Code command adapter and runtime bridge.
3. TASK-066: implement native webview providers for the three core views.
4. TASK-067: implement runtime composer and proposal review panels.
5. TASK-068: add workspace state persistence.
6. TASK-069: add packaging and smoke validation.

## TASK-064: Extension Scaffold

Adds the VS Code extension body:

- manifest/contribution metadata;
- activation/deactivation entrypoint;
- initial command/view IDs;
- extension context bootstrap;
- scaffold validation.

Review decision needed:

- Should activation be command-based, view-based, workspace-file-based, or all three?

## TASK-065: Command Adapter

Adds the adapter from VS Code commands to ThinkIO runtime commands:

- `thinkio.*` VS Code command IDs;
- runtime bridge;
- structured command results;
- direct-mutation guard;
- command adapter tests.

Review decision needed:

- Should command failures surface as notifications, panel messages, or both?

## TASK-066: Core Webview Providers

Adds native ThinkIO views:

- task Kanban;
- artifact mind-map;
- runtime node diagram.

Each view reads projections and sends actions through the command adapter.

Review decision needed:

- Should views read generated JSON first, or call projection builders live from runtime state?

## TASK-067: Composer And Proposal Review

Adds governed model interaction panels:

- runtime composer;
- proposal review;
- interaction log write path;
- task proposal review/save path.

Review decision needed:

- Should interaction logs and task proposals start in `state/*.json`, workspace storage, or both?

## TASK-068: Workspace State

Adds UI-only persistence:

- selected runtime record;
- collapsed groups;
- zoom/pan/layout hints;
- trace/execution visibility mode.

Review decision needed:

- Should trace mode persist per workspace or globally?

## TASK-069: Packaging And Smoke Validation

Adds proof that ThinkIO can run as a plugin:

- package/build script;
- local runbook;
- activation smoke test;
- core view smoke test;
- packaged asset validation.

Review decision needed:

- Should packaging use `@vscode/vsce` immediately, or start with a validation-first local package script?

## Non-Negotiable Boundaries

- No external Kanban, mind-map, graph, flowchart, or node-diagram VS Code plugin dependency.
- No direct task JSON writes from webview UI.
- No generic chat transcript as the primary model surface.
- No model output file writes outside file action proposals.
- No archive/old-runtime activation.
- No UI layout metadata as authority.

## Review Outcome Wanted

Before execution, decide:

- command naming;
- activation triggers;
- webview data source strategy;
- interaction/proposal storage location;
- trace mode persistence scope;
- packaging strategy.

After those decisions, TASK-064 can start safely.

# Product Runtime Boundary

ThinkIO is currently a local governed runtime with a VS Code plugin as the next product shell.

The first product runtime should stay smaller than the eventual full app. It should make the existing runtime usable in local project work before adding standalone application infrastructure.

## In Scope For First Product Runtime

- VS Code plugin packaging.
- Workboard, context, proposal review, and runtime projection views.
- Commands that call existing runtime entry points.
- Bounded model handoff through work packages and provider output ingest.
- Writer-boundary proposals for file changes.
- Checkpoints, closeout records, package/history manifests, and validation output.

## Out Of Scope For First Product Runtime

- Standalone full app shell.
- Native full-app chatbox as primary interface.
- Persistent daemon as a requirement for MVP.
- Autonomous replay that mutates project state without user approval.
- External API integrations that bypass provider adapters and governance decisions.

## Roadmap Rule

The VS Code plugin should prove the runtime boundary first. A full app can add richer chat and multi-project surfaces after the plugin demonstrates that ThinkIO can govern model handoff, proposal review, validation, and file writes from canonical runtime state.

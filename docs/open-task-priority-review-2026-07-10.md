# Open Task Priority Review

Date: 2026-07-10

## Current Objective

Move ThinkIO from a validated local plugin shell into usable native VS Code plugin views.

## Completed In The Stress Pass

- TASK-102: Extension Host lifecycle stress test.
- TASK-103: projection refresh and file watcher stress test.
- TASK-104: Project Navigation and search stress test.
- TASK-105: command governance and composer stress test.
- TASK-106: local VSIX install and workspace stress test.
- TASK-107: stress findings compilation and follow-up task creation.

Reports:

- `docs/vscode-plugin-stress-findings-report-2026-07-10.md`
- `docs/thinkio-plugin-view-ui-audit-2026-07-10.md`

## Candidate Order

1. TASK-108: Add automated isolated VSIX install validation.
2. TASK-117: Expand model-facing BAML contract coverage.
3. TASK-118: Evaluate BAML CLI generator boundary.
4. TASK-109: Define ThinkIO-native webview presentation architecture.
5. TASK-110: Implement native Task Kanban webview presentation.
6. TASK-111: Implement Project Navigation search UI.
7. TASK-112: Implement Artifact Mind Map visual presentation.
8. TASK-113: Implement Runtime Node Diagram interactive presentation.
9. TASK-114: Implement Runtime Composer and Proposal Review UI.
10. TASK-115: Add webview UI stress and visual smoke validation.

## Why This Order

Start with automated real VSIX install validation because stress testing found a package blocker that the previous validator missed.

Then repair the model-facing contract plan because Runtime Composer, Proposal Review, and future provider integration need explicit structured model I/O boundaries.

Then define the shared webview presentation architecture so the UI work does not duplicate shell, governance, empty state, and error handling.

Then implement Task Kanban first because it is the view currently being replaced by an external plugin in practice.

Then improve Project Navigation because it is the orientation/search surface that helps continue work inside ThinkIO.

Then implement Artifact Mind Map and Runtime Node Diagram as the visual project-understanding surfaces.

Then implement Runtime Composer and Proposal Review as governed workflow surfaces.

Finally, add visual/webview stress validation before calling the plugin locally usable.

## Expected Output

The next phase should produce:

- a real package install validation script;
- expanded model-facing BAML contract coverage or explicit deferrals;
- a decision on whether BAML remains under `contracts/baml/` or gains a generated-client toolchain;
- a documented webview presentation contract;
- native Kanban, Project Navigation, Mind Map, Runtime Node Diagram, Composer, and Proposal Review interfaces;
- view-specific tests that prove ThinkIO is no longer only rendering raw JSON projections.

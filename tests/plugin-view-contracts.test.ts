import test from "node:test";
import assert from "node:assert/strict";
import {
  buildArtifactMindmapPluginView,
  buildPluginViewArchitectureContract,
  buildRuntimeNodeDiagramPluginView,
  buildTaskKanbanPluginView,
  auditPluginMaturity,
  explainArtifactMindmapPluginViewBlockers,
  explainChatToTaskProposalBlockers,
  explainCrossViewSelectionSyncBlockers,
  explainHistoricalChatLogImportPolicyBlockers,
  explainPluginCommandRouteBlockers,
  explainPluginInteractionLogBlockers,
  explainPluginViewArchitectureBlockers,
  explainPluginViewStateBlockers,
  explainRuntimeComposerSurfaceBlockers,
  explainRuntimeNodeDiagramPluginViewBlockers,
  explainSelfContainedPluginBundleBlockers,
  explainTaskKanbanPluginViewBlockers,
  explainTraceTranscriptPolicyBlockers,
  missingChatToTaskProposalFields,
  type ChatToTaskProposal,
  type CrossViewSelectionSyncContract,
  type HistoricalChatLogImportPolicy,
  type PluginBundleManifest,
  type PluginInteractionLogRecord,
  type PluginViewState,
  type RuntimeComposerSurfaceContract,
  type TraceTranscriptPolicy
} from "../kernel/plugin-view-contracts.ts";
import { buildNativeBoardProjection, buildRuntimeMindmapProjection } from "../kernel/runtime-projections.ts";
import type { GovernedTask, Workboard } from "../kernel/types.ts";

const baseTask: GovernedTask = {
  id: "TASK-900",
  title: "Model plugin view contracts",
  mode: "plan",
  status: "candidate",
  authority: "candidate",
  dependencies: ["TASK-050"],
  allowedContext: ["docs/vscode-plugin-runtime-shell.md"],
  blockedContext: ["archive/"],
  requiredEvidence: ["plugin-view-contracts-pass"],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

const workboard: Workboard = {
  id: "WB-900",
  taskIds: ["TASK-900"],
  updatedAt: "2026-07-04T00:00:00.000Z",
  steps: [
    {
      id: "STEP-900",
      taskId: "TASK-900",
      title: "Wire plugin projection",
      workflowPosition: "current",
      status: "open",
      order: 1,
      artifactLinks: ["docs/vscode-plugin-runtime-shell.md"]
    }
  ]
};

test("plugin view architecture defines all required native views and command routes", () => {
  const contract = buildPluginViewArchitectureContract();

  assert.deepEqual(explainPluginViewArchitectureBlockers(contract), []);
  assert.equal(contract.externalPluginRuntimeDependenciesAllowed, false);
  assert.ok(contract.views.includes("task-kanban"));
  assert.ok(contract.views.includes("artifact-mindmap"));
  assert.ok(contract.views.includes("runtime-node-diagram"));
  assert.ok(contract.commandRoutes.some((route) => route.commandId === "plugin.switch-mode"));
  assert.ok(contract.commandRoutes.some((route) => route.commandId === "plugin.add-task-proposal"));
  assert.ok(contract.commandRoutes.some((route) => route.commandId === "plugin.save-task-proposal"));
});

test("plugin view state validates UI-only geometry and selection metadata", () => {
  const state: PluginViewState = {
    viewId: "thinkio.taskKanban",
    kind: "task-kanban",
    selectedRecord: { kind: "task", id: "TASK-900" },
    collapsedGroupIds: ["resolved"],
    layoutHints: { density: "compact" },
    zoom: 1,
    pan: { x: 0, y: 0 },
    refreshedAt: "2026-07-04T00:00:00.000Z"
  };

  assert.deepEqual(explainPluginViewStateBlockers(state), []);
  assert.deepEqual(explainPluginViewStateBlockers({ ...state, zoom: 0 }), [
    "Plugin view zoom must be a positive number."
  ]);
});

test("cross-view selection sync highlights and filters without mutating canonical state", () => {
  const sync: CrossViewSelectionSyncContract = {
    selectedRecord: { kind: "task", id: "TASK-900" },
    participatingViews: ["task-kanban", "artifact-mindmap", "runtime-node-diagram"],
    highlightedRecordIds: ["TASK-900", "STEP-900", "CTX-900"],
    filteredRecordIds: ["TASK-900", "STEP-900"],
    viewStateOnly: true,
    canonicalTaskStatusBefore: "candidate",
    canonicalTaskStatusAfter: "candidate",
    canonicalAuthorityBefore: "candidate",
    canonicalAuthorityAfter: "candidate"
  };

  assert.deepEqual(explainCrossViewSelectionSyncBlockers(sync), []);
  assert.deepEqual(
    explainCrossViewSelectionSyncBlockers({
      ...sync,
      canonicalAuthorityAfter: "accepted"
    }),
    ["Cross-view selection must not mutate canonical authority."]
  );
});

test("native task Kanban plugin view routes movement through runtime governance", () => {
  const projection = buildNativeBoardProjection({
    id: "NBP-900",
    tasks: [baseTask],
    workboard
  });
  const view = buildTaskKanbanPluginView(projection);

  assert.equal(view.sourceOfTruth, "native-board-projection");
  assert.deepEqual(explainTaskKanbanPluginViewBlockers(view), []);
  assert.equal(view.actions.find((action) => action.action === "move-card")?.requiresApproval, true);
});

test("artifact mind-map and runtime node diagram use deterministic runtime projections", () => {
  const projection = buildRuntimeMindmapProjection({
    tasks: [baseTask],
    workboard,
    contextCards: [
      {
        id: "CTX-900",
        type: "idea",
        authority: "idea",
        relevance: "high",
        attachment: { kind: "task", id: "TASK-900" },
        relationship: "supports",
        body: "Plugin interaction should stay governed.",
        status: "attached",
        promotionTargets: ["task"]
      }
    ],
    validationResults: [
      {
        id: "VAL-900",
        stage: "post-ingest",
        ok: true,
        blockers: [],
        createdAt: "2026-07-04T00:00:00.000Z"
      }
    ]
  });

  const mindmap = buildArtifactMindmapPluginView(projection);
  const diagram = buildRuntimeNodeDiagramPluginView(projection);

  assert.deepEqual(explainArtifactMindmapPluginViewBlockers(mindmap), []);
  assert.deepEqual(explainRuntimeNodeDiagramPluginViewBlockers(diagram), []);
  assert.equal(diagram.geometryIsAuthority, false);
  assert.ok(mindmap.nodes.some((node) => node.kind === "context-card"));
  assert.ok(diagram.interactions.includes("inspect-blocker"));
});

test("self-contained plugin bundle blocks external view plugin dependencies", () => {
  const manifest: PluginBundleManifest = {
    bundledViews: ["task-kanban", "artifact-mindmap", "runtime-node-diagram"],
    bundledAssets: ["media/task-kanban.js", "media/artifact-mindmap.js", "media/runtime-node-diagram.js"],
    extensionDependencies: [],
    ordinaryLibraryDependencies: ["@vscode/webview-ui-toolkit"]
  };

  assert.deepEqual(explainSelfContainedPluginBundleBlockers(manifest), []);
  assert.deepEqual(
    explainSelfContainedPluginBundleBlockers({
      ...manifest,
      extensionDependencies: ["publisher.kanban-board"]
    }),
    ["External view plugin dependency is not allowed: publisher.kanban-board."]
  );
});

test("plugin command routes block direct canonical mutation without approval", () => {
  assert.deepEqual(
    explainPluginCommandRouteBlockers({
      commandId: "plugin.save-task-proposal",
      runtimeAction: "plan-mutation-transaction",
      mutatesCanonicalState: true,
      requiresApproval: false,
      producesProposal: false
    }),
    ["Plugin command plugin.save-task-proposal mutates canonical state without approval."]
  );
});

test("plugin interaction logs attach to runtime records without becoming canonical state", () => {
  const record: PluginInteractionLogRecord = {
    id: "INT-900",
    kind: "prompt",
    attachedRuntimeRecordIds: ["TASK-900"],
    selectedContextIds: ["TASK-900", "STEP-900"],
    providerLabel: "local",
    modelLabel: "planning-model",
    payloadRef: "interaction-log/INT-900",
    canonicalStateMutation: false,
    transcriptGrade: false,
    createdAt: "2026-07-04T00:00:00.000Z"
  };

  assert.deepEqual(explainPluginInteractionLogBlockers(record), []);
  assert.deepEqual(explainPluginInteractionLogBlockers({ ...record, attachedRuntimeRecordIds: [] }), [
    "Interaction log INT-900 must attach to runtime records."
  ]);
});

test("runtime composer surface is result-based and not a generic transcript", () => {
  const composer: RuntimeComposerSurfaceContract = {
    id: "COMPOSER-900",
    selectedContextIds: ["TASK-900"],
    resultState: "proposal",
    followUpCommands: ["plugin.open-proposal-review", "plugin.request-approval"],
    interactionLogIds: ["INT-900"],
    usesGenericTranscript: false
  };

  assert.deepEqual(explainRuntimeComposerSurfaceBlockers(composer), []);
  assert.deepEqual(explainRuntimeComposerSurfaceBlockers({ ...composer, selectedContextIds: [] }), [
    "Runtime composer COMPOSER-900 requires selected context."
  ]);
});

test("chat-to-task proposal gathers required fields before canonical task creation", () => {
  const proposal: ChatToTaskProposal = {
    id: "CTP-900",
    title: "Add plugin task intake",
    mode: "plan",
    priority: "high",
    dependencies: ["TASK-059"],
    allowedContext: ["docs/vscode-plugin-runtime-shell.md"],
    blockedContext: ["archive/"],
    requiredEvidence: ["chat-task-proposal-tests-pass"],
    status: "proposal",
    createdFromInteractionLogId: "INT-900",
    reviewed: false
  };

  assert.deepEqual(missingChatToTaskProposalFields(proposal), []);
  assert.deepEqual(explainChatToTaskProposalBlockers(proposal), []);
  assert.deepEqual(
    explainChatToTaskProposalBlockers({
      ...proposal,
      canonicalTaskId: "TASK-901"
    }),
    ["Chat-to-task proposal CTP-900 cannot create canonical task state before approval."]
  );
});

test("trace transcript policy keeps transcript-grade capture optional and audit-mode separate", () => {
  const policy: TraceTranscriptPolicy = {
    id: "TRACE-POLICY-001",
    defaultMode: "execution",
    supportedModes: ["execution", "trace", "audit-candidate"],
    transcriptGradeDefault: false,
    transcriptGradeTriggers: ["explicit-user-request", "reentry-validation", "high-continuity-risk", "audit-review"],
    auditModeIsCandidateOnly: true,
    normalInteractionLogRequired: true
  };

  assert.deepEqual(explainTraceTranscriptPolicyBlockers(policy), []);
  assert.deepEqual(
    explainTraceTranscriptPolicyBlockers({
      ...policy,
      transcriptGradeTriggers: ["reentry-validation"]
    }),
    ["Transcript-grade preservation must require an explicit user-request trigger."]
  );
});

test("historical chat log import policy keeps legacy logs evidence-only and post-MVP", () => {
  const policy: HistoricalChatLogImportPolicy = {
    id: "HIST-CHAT-IMPORT-001",
    importBelongsToPluginMvp: false,
    historicalLogsAreAuthority: false,
    allowedImportDisposition: "structured-interaction-log-evidence",
    requiredFields: ["sourcePath", "checksum", "authorityLevel", "redactionDecision", "currentStateCompatibility"],
    forbiddenEffects: ["task-creation", "file-write", "checkpoint-change", "state-transition"]
  };

  assert.deepEqual(explainHistoricalChatLogImportPolicyBlockers(policy), []);
  assert.deepEqual(
    explainHistoricalChatLogImportPolicyBlockers({
      ...policy,
      forbiddenEffects: ["task-creation", "file-write", "checkpoint-change"]
    }),
    ["Historical chat import must forbid state-transition."]
  );
});

test("plugin maturity audit separates architecture readiness from usable VS Code plugin readiness", () => {
  const result = auditPluginMaturity({
    hasExtensionManifest: false,
    hasActivationEntrypoint: false,
    hasVsCodeCommandRegistration: false,
    hasWebviewViewProviders: false,
    hasRuntimeCommandAdapter: false,
    hasBundledViewAssets: false,
    hasWorkspaceStatePersistence: false,
    hasVsixPackagingScript: false,
    hasExtensionSmokeTest: false
  });

  assert.equal(result.matureEnoughForArchitecture, true);
  assert.equal(result.matureEnoughForUsableVsCodePlugin, false);
  assert.match(result.blockers.join("\n"), /Missing VS Code extension manifest/);
  assert.match(result.blockers.join("\n"), /Missing native webview view providers/);
  assert.match(result.blockers.join("\n"), /Missing VS Code extension smoke test/);
});

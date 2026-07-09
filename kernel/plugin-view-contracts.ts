import { isAllowedLocalDevAction } from "../runtime/command-registry.ts";
import type {
  NativeBoardProjection,
  RuntimeMindmapEdgeKind,
  RuntimeMindmapNodeKind,
  RuntimeMindmapProjection,
  TaskMode
} from "./types.ts";

export const PLUGIN_VIEW_KINDS = [
  "task-kanban",
  "artifact-mindmap",
  "runtime-node-diagram",
  "context-panel",
  "proposal-review",
  "runtime-composer"
] as const;

export type PluginViewKind = (typeof PLUGIN_VIEW_KINDS)[number];

export const PLUGIN_SELECTABLE_RECORD_KINDS = [
  "task",
  "step",
  "artifact",
  "source",
  "rule",
  "context-card",
  "validation-run",
  "work-package",
  "provider-output",
  "proposal",
  "interaction-log"
] as const;

export type PluginSelectableRecordKind = (typeof PLUGIN_SELECTABLE_RECORD_KINDS)[number];

export const PLUGIN_COMMAND_IDS = [
  "plugin.refresh-view",
  "plugin.select-record",
  "plugin.open-record",
  "plugin.switch-mode",
  "plugin.add-task-proposal",
  "plugin.save-task-proposal",
  "plugin.create-work-package",
  "plugin.ingest-provider-output",
  "plugin.request-approval",
  "plugin.defer-work",
  "plugin.reject-proposal",
  "plugin.apply-approved-proposal",
  "plugin.open-proposal-review",
  "plugin.record-interaction",
  "plugin.submit-runtime-composer"
] as const;

export type PluginCommandId = (typeof PLUGIN_COMMAND_IDS)[number];

export interface PluginViewState {
  viewId: string;
  kind: PluginViewKind;
  selectedRecord?: {
    kind: PluginSelectableRecordKind;
    id: string;
  };
  collapsedGroupIds: string[];
  layoutHints: Record<string, string | number | boolean>;
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  refreshedAt: string;
}

export interface CrossViewSelectionSyncContract {
  selectedRecord: {
    kind: PluginSelectableRecordKind;
    id: string;
  };
  participatingViews: PluginViewKind[];
  highlightedRecordIds: string[];
  filteredRecordIds: string[];
  viewStateOnly: true;
  canonicalTaskStatusBefore: string;
  canonicalTaskStatusAfter: string;
  canonicalAuthorityBefore: string;
  canonicalAuthorityAfter: string;
}

export interface PluginCommandRoute {
  commandId: PluginCommandId;
  runtimeAction: string;
  mutatesCanonicalState: boolean;
  requiresApproval: boolean;
  producesProposal: boolean;
}

export interface PluginViewDataProviderContract {
  viewKind: PluginViewKind;
  projectionName: string;
  refreshCommand: PluginCommandId;
  sourceOfTruth: "runtime-projection";
}

export interface PluginViewArchitectureContract {
  views: PluginViewKind[];
  dataProviders: PluginViewDataProviderContract[];
  commandRoutes: PluginCommandRoute[];
  sharedStateFields: Array<keyof PluginViewState>;
  externalPluginRuntimeDependenciesAllowed: false;
}

export interface TaskKanbanPluginView {
  kind: "task-kanban";
  lanes: NativeBoardProjection["lanes"];
  actions: NativeBoardProjection["actions"];
  sourceOfTruth: "native-board-projection";
}

export interface ArtifactMindmapPluginView {
  kind: "artifact-mindmap";
  nodes: RuntimeMindmapProjection["nodes"];
  edges: RuntimeMindmapProjection["edges"];
  filters: Array<"task" | "artifact" | "source" | "authority" | "validation-state" | "friction">;
  sourceOfTruth: "runtime-mindmap-projection";
}

export interface RuntimeNodeDiagramPluginView {
  kind: "runtime-node-diagram";
  nodes: RuntimeMindmapProjection["nodes"];
  edges: RuntimeMindmapProjection["edges"];
  interactions: Array<"select" | "focus-path" | "expand-collapse" | "inspect-blocker">;
  geometryIsAuthority: false;
  sourceOfTruth: "runtime-projection";
}

export interface PluginBundleManifest {
  bundledViews: PluginViewKind[];
  bundledAssets: string[];
  extensionDependencies: string[];
  ordinaryLibraryDependencies: string[];
}

export const PLUGIN_INTERACTION_LOG_KINDS = [
  "prompt",
  "reply",
  "command-intent",
  "result-reference",
  "follow-up-action"
] as const;

export type PluginInteractionLogKind = (typeof PLUGIN_INTERACTION_LOG_KINDS)[number];

export interface PluginInteractionLogRecord {
  id: string;
  kind: PluginInteractionLogKind;
  attachedRuntimeRecordIds: string[];
  selectedContextIds: string[];
  providerLabel?: string;
  modelLabel?: string;
  payloadRef: string;
  canonicalStateMutation: false;
  transcriptGrade: boolean;
  createdAt: string;
}

export const RUNTIME_COMPOSER_RESULT_STATES = [
  "empty",
  "proposal",
  "approval-required",
  "blocked",
  "approved",
  "applied",
  "rejected",
  "deferred-pending-write"
] as const;

export type RuntimeComposerResultState = (typeof RUNTIME_COMPOSER_RESULT_STATES)[number];

export interface RuntimeComposerSurfaceContract {
  id: string;
  selectedContextIds: string[];
  resultState: RuntimeComposerResultState;
  followUpCommands: PluginCommandId[];
  interactionLogIds: string[];
  usesGenericTranscript: false;
}

export const CHAT_TASK_PROPOSAL_STATUSES = [
  "draft",
  "needs-info",
  "proposal",
  "approved",
  "rejected"
] as const;

export type ChatTaskProposalStatus = (typeof CHAT_TASK_PROPOSAL_STATUSES)[number];

export interface ChatToTaskProposal {
  id: string;
  title?: string;
  mode?: TaskMode;
  priority?: "low" | "medium" | "high";
  dependencies?: string[];
  allowedContext?: string[];
  blockedContext?: string[];
  requiredEvidence?: string[];
  status: ChatTaskProposalStatus;
  createdFromInteractionLogId: string;
  reviewed: boolean;
  canonicalTaskId?: string;
}

export const TRACE_VISIBILITY_MODES = ["execution", "trace", "audit-candidate"] as const;

export type TraceVisibilityMode = (typeof TRACE_VISIBILITY_MODES)[number];

export interface TraceTranscriptPolicy {
  id: string;
  defaultMode: "execution";
  supportedModes: TraceVisibilityMode[];
  transcriptGradeDefault: false;
  transcriptGradeTriggers: Array<"explicit-user-request" | "reentry-validation" | "high-continuity-risk" | "audit-review">;
  auditModeIsCandidateOnly: true;
  normalInteractionLogRequired: true;
}

export interface HistoricalChatLogImportPolicy {
  id: string;
  importBelongsToPluginMvp: false;
  historicalLogsAreAuthority: false;
  allowedImportDisposition: "evidence-only" | "structured-interaction-log-evidence";
  requiredFields: Array<"sourcePath" | "checksum" | "authorityLevel" | "redactionDecision" | "currentStateCompatibility">;
  forbiddenEffects: Array<"task-creation" | "file-write" | "checkpoint-change" | "state-transition">;
}

export interface PluginMaturityAuditInput {
  hasExtensionManifest: boolean;
  hasActivationEntrypoint: boolean;
  hasVsCodeCommandRegistration: boolean;
  hasWebviewViewProviders: boolean;
  hasRuntimeCommandAdapter: boolean;
  hasBundledViewAssets: boolean;
  hasWorkspaceStatePersistence: boolean;
  hasVsixPackagingScript: boolean;
  hasExtensionSmokeTest: boolean;
}

export interface PluginMaturityAuditResult {
  matureEnoughForArchitecture: boolean;
  matureEnoughForUsableVsCodePlugin: boolean;
  blockers: string[];
}

const defaultCommandRoutes: PluginCommandRoute[] = [
  commandRoute("plugin.refresh-view", "update-views", false, false, false),
  commandRoute("plugin.select-record", "build-context-packet", false, false, false),
  commandRoute("plugin.open-record", "build-context-packet", false, false, false),
  commandRoute("plugin.switch-mode", "evaluate-governance-decision", false, false, true),
  commandRoute("plugin.add-task-proposal", "evaluate-governance-decision", false, false, true),
  commandRoute("plugin.save-task-proposal", "plan-mutation-transaction", true, true, false),
  commandRoute("plugin.create-work-package", "validate-work-package", false, false, true),
  commandRoute("plugin.ingest-provider-output", "validate-provider-output-ingest", false, false, true),
  commandRoute("plugin.request-approval", "evaluate-governance-decision", false, false, false),
  commandRoute("plugin.defer-work", "evaluate-governance-decision", false, false, true),
  commandRoute("plugin.reject-proposal", "evaluate-governance-decision", false, false, false),
  commandRoute("plugin.apply-approved-proposal", "apply-mutation-transaction", true, true, false),
  commandRoute("plugin.open-proposal-review", "validate-interaction-surface", false, false, false),
  commandRoute("plugin.record-interaction", "validate-interaction-surface", false, false, false),
  commandRoute("plugin.submit-runtime-composer", "validate-interaction-surface", false, false, true)
];

const defaultDataProviders: PluginViewDataProviderContract[] = [
  dataProvider("task-kanban", "native-board-projection"),
  dataProvider("artifact-mindmap", "runtime-mindmap-projection"),
  dataProvider("runtime-node-diagram", "runtime-flow-projection"),
  dataProvider("context-panel", "context-packet-projection"),
  dataProvider("proposal-review", "provider-output-ingest-projection"),
  dataProvider("runtime-composer", "interaction-surface-projection")
];

const mindmapNodeKinds = new Set<RuntimeMindmapNodeKind>([
  "task",
  "step",
  "source",
  "artifact",
  "rule",
  "context-card",
  "branch",
  "work-package",
  "provider-output",
  "derivation",
  "friction",
  "validation-run"
]);

const mindmapEdgeKinds = new Set<RuntimeMindmapEdgeKind>([
  "depends-on",
  "derived-from",
  "validates",
  "blocks",
  "attached-to",
  "exports-to",
  "ingests-from",
  "promotes-to"
]);

export function buildPluginViewArchitectureContract(): PluginViewArchitectureContract {
  return {
    views: [...PLUGIN_VIEW_KINDS],
    dataProviders: [...defaultDataProviders],
    commandRoutes: [...defaultCommandRoutes],
    sharedStateFields: [
      "viewId",
      "kind",
      "selectedRecord",
      "collapsedGroupIds",
      "layoutHints",
      "zoom",
      "pan",
      "refreshedAt"
    ],
    externalPluginRuntimeDependenciesAllowed: false
  };
}

export function explainPluginViewArchitectureBlockers(contract: PluginViewArchitectureContract): string[] {
  const blockers: string[] = [];

  for (const view of PLUGIN_VIEW_KINDS) {
    if (!contract.views.includes(view)) blockers.push(`Missing plugin view ${view}.`);
    if (!contract.dataProviders.some((provider) => provider.viewKind === view)) {
      blockers.push(`Missing data provider for plugin view ${view}.`);
    }
  }

  for (const command of PLUGIN_COMMAND_IDS) {
    if (!contract.commandRoutes.some((route) => route.commandId === command)) {
      blockers.push(`Missing plugin command route ${command}.`);
    }
  }

  if (contract.externalPluginRuntimeDependenciesAllowed !== false) {
    blockers.push("Plugin view architecture must block external view plugin runtime dependencies.");
  }

  return [...blockers, ...contract.commandRoutes.flatMap(explainPluginCommandRouteBlockers)];
}

export function explainPluginViewStateBlockers(state: PluginViewState): string[] {
  const blockers: string[] = [];

  if (!state.viewId) blockers.push("Plugin view state requires a view id.");
  if (!PLUGIN_VIEW_KINDS.includes(state.kind)) blockers.push(`Unsupported plugin view kind ${state.kind}.`);
  if (state.selectedRecord && !state.selectedRecord.id) blockers.push("Selected plugin record requires an id.");
  if (!Number.isFinite(state.zoom) || state.zoom <= 0) blockers.push("Plugin view zoom must be a positive number.");
  if (!Number.isFinite(state.pan.x) || !Number.isFinite(state.pan.y)) {
    blockers.push("Plugin view pan must use finite x/y coordinates.");
  }
  if (!Date.parse(state.refreshedAt)) blockers.push("Plugin view state requires a valid refresh timestamp.");

  return blockers;
}

export function explainCrossViewSelectionSyncBlockers(contract: CrossViewSelectionSyncContract): string[] {
  const blockers: string[] = [];

  if (!contract.selectedRecord.id) blockers.push("Cross-view selected runtime record requires an id.");
  if (contract.participatingViews.length < 2) blockers.push("Cross-view sync requires at least two participating views.");
  if (contract.viewStateOnly !== true) blockers.push("Cross-view selection sync must remain UI/view state only.");
  if (contract.canonicalTaskStatusBefore !== contract.canonicalTaskStatusAfter) {
    blockers.push("Cross-view selection must not mutate canonical task status.");
  }
  if (contract.canonicalAuthorityBefore !== contract.canonicalAuthorityAfter) {
    blockers.push("Cross-view selection must not mutate canonical authority.");
  }

  return blockers;
}

export function explainPluginCommandRouteBlockers(route: PluginCommandRoute): string[] {
  const blockers: string[] = [];

  if (!PLUGIN_COMMAND_IDS.includes(route.commandId)) blockers.push(`Unknown plugin command ${route.commandId}.`);
  if (!isAllowedLocalDevAction(route.runtimeAction)) {
    blockers.push(`Plugin command ${route.commandId} routes to blocked runtime action ${route.runtimeAction}.`);
  }
  if (route.mutatesCanonicalState && !route.requiresApproval) {
    blockers.push(`Plugin command ${route.commandId} mutates canonical state without approval.`);
  }
  if (
    (route.commandId === "plugin.add-task-proposal" || route.commandId === "plugin.submit-runtime-composer") &&
    !route.producesProposal
  ) {
    blockers.push(`Plugin command ${route.commandId} must produce a proposal before mutation.`);
  }

  return blockers;
}

export function buildTaskKanbanPluginView(projection: NativeBoardProjection): TaskKanbanPluginView {
  return {
    kind: "task-kanban",
    lanes: projection.lanes,
    actions: projection.actions,
    sourceOfTruth: "native-board-projection"
  };
}

export function explainTaskKanbanPluginViewBlockers(view: TaskKanbanPluginView): string[] {
  const blockers: string[] = [];

  if (view.sourceOfTruth !== "native-board-projection") {
    blockers.push("Task Kanban plugin view must read from the native board projection.");
  }
  for (const action of view.actions) {
    if (!isAllowedLocalDevAction(action.runtimeCommand)) {
      blockers.push(`Kanban action ${action.action} routes to blocked runtime command ${action.runtimeCommand}.`);
    }
    if (action.action === "move-card" && !action.requiresApproval) {
      blockers.push("Kanban move-card must require approval or proposal review.");
    }
  }

  return blockers;
}

export function buildArtifactMindmapPluginView(projection: RuntimeMindmapProjection): ArtifactMindmapPluginView {
  return {
    kind: "artifact-mindmap",
    nodes: projection.nodes,
    edges: projection.edges,
    filters: ["task", "artifact", "source", "authority", "validation-state", "friction"],
    sourceOfTruth: "runtime-mindmap-projection"
  };
}

export function explainArtifactMindmapPluginViewBlockers(view: ArtifactMindmapPluginView): string[] {
  const blockers: string[] = [];

  if (view.sourceOfTruth !== "runtime-mindmap-projection") {
    blockers.push("Artifact mind-map plugin view must read from the runtime mind-map projection.");
  }
  for (const node of view.nodes) {
    if (!mindmapNodeKinds.has(node.kind)) blockers.push(`Unsupported mind-map node kind ${node.kind}.`);
  }
  for (const edge of view.edges) {
    if (!mindmapEdgeKinds.has(edge.kind)) blockers.push(`Unsupported mind-map edge kind ${edge.kind}.`);
  }

  return blockers;
}

export function buildRuntimeNodeDiagramPluginView(projection: RuntimeMindmapProjection): RuntimeNodeDiagramPluginView {
  return {
    kind: "runtime-node-diagram",
    nodes: projection.nodes,
    edges: projection.edges,
    interactions: ["select", "focus-path", "expand-collapse", "inspect-blocker"],
    geometryIsAuthority: false,
    sourceOfTruth: "runtime-projection"
  };
}

export function explainRuntimeNodeDiagramPluginViewBlockers(view: RuntimeNodeDiagramPluginView): string[] {
  const blockers: string[] = [];

  if (view.geometryIsAuthority !== false) {
    blockers.push("Runtime node diagram geometry must remain UI metadata only.");
  }
  if (!view.interactions.includes("inspect-blocker")) {
    blockers.push("Runtime node diagram must support blocker inspection.");
  }
  for (const edge of view.edges) {
    if (!mindmapEdgeKinds.has(edge.kind)) blockers.push(`Unsupported runtime diagram edge kind ${edge.kind}.`);
  }

  return blockers;
}

export function explainSelfContainedPluginBundleBlockers(manifest: PluginBundleManifest): string[] {
  const blockers: string[] = [];

  for (const view of ["task-kanban", "artifact-mindmap", "runtime-node-diagram"] as const) {
    if (!manifest.bundledViews.includes(view)) blockers.push(`Plugin bundle must include ${view}.`);
  }
  if (manifest.bundledAssets.length === 0) blockers.push("Plugin bundle must declare bundled view assets.");

  for (const dependency of manifest.extensionDependencies) {
    if (/(kanban|mind.?map|node.?diagram|flowchart|graph)/i.test(dependency)) {
      blockers.push(`External view plugin dependency is not allowed: ${dependency}.`);
    }
  }

  return blockers;
}

export function explainPluginInteractionLogBlockers(record: PluginInteractionLogRecord): string[] {
  const blockers: string[] = [];

  if (!record.id) blockers.push("Interaction log record id is required.");
  if (!record.payloadRef) blockers.push(`Interaction log ${record.id} requires a payload reference.`);
  if (record.attachedRuntimeRecordIds.length === 0) {
    blockers.push(`Interaction log ${record.id} must attach to runtime records.`);
  }
  if (record.canonicalStateMutation !== false) {
    blockers.push(`Interaction log ${record.id} must not mutate canonical state.`);
  }
  if (!Date.parse(record.createdAt)) blockers.push(`Interaction log ${record.id} requires a valid timestamp.`);

  return blockers;
}

export function explainRuntimeComposerSurfaceBlockers(contract: RuntimeComposerSurfaceContract): string[] {
  const blockers: string[] = [];

  if (!contract.id) blockers.push("Runtime composer surface id is required.");
  if (contract.selectedContextIds.length === 0) {
    blockers.push(`Runtime composer ${contract.id} requires selected context.`);
  }
  if (contract.usesGenericTranscript !== false) {
    blockers.push(`Runtime composer ${contract.id} must not behave as a generic chat transcript.`);
  }
  for (const command of contract.followUpCommands) {
    if (!PLUGIN_COMMAND_IDS.includes(command)) blockers.push(`Unknown composer follow-up command ${command}.`);
  }

  return blockers;
}

export function missingChatToTaskProposalFields(proposal: ChatToTaskProposal): string[] {
  const missing: string[] = [];

  if (!proposal.title) missing.push("title");
  if (!proposal.mode) missing.push("mode");
  if (!proposal.priority) missing.push("priority");
  if (proposal.dependencies === undefined) missing.push("dependencies");
  if (proposal.allowedContext === undefined) missing.push("allowedContext");
  if (proposal.blockedContext === undefined) missing.push("blockedContext");
  if (proposal.requiredEvidence === undefined || proposal.requiredEvidence.length === 0) {
    missing.push("requiredEvidence");
  }

  return missing;
}

export function explainChatToTaskProposalBlockers(proposal: ChatToTaskProposal): string[] {
  const blockers: string[] = [];

  if (!proposal.id) blockers.push("Chat-to-task proposal id is required.");
  if (!proposal.createdFromInteractionLogId) {
    blockers.push(`Chat-to-task proposal ${proposal.id} requires an interaction log source.`);
  }
  if (proposal.status === "approved" && missingChatToTaskProposalFields(proposal).length > 0) {
    blockers.push(`Approved chat-to-task proposal ${proposal.id} is missing required task fields.`);
  }
  if (proposal.canonicalTaskId && (!proposal.reviewed || proposal.status !== "approved")) {
    blockers.push(`Chat-to-task proposal ${proposal.id} cannot create canonical task state before approval.`);
  }

  return blockers;
}

export function explainTraceTranscriptPolicyBlockers(policy: TraceTranscriptPolicy): string[] {
  const blockers: string[] = [];

  if (!policy.id) blockers.push("Trace transcript policy id is required.");
  if (policy.defaultMode !== "execution") blockers.push("Trace policy default mode must remain execution.");
  if (!policy.supportedModes.includes("trace")) blockers.push("Trace policy must support trace visibility mode.");
  if (policy.transcriptGradeDefault !== false) {
    blockers.push("Transcript-grade preservation must not be enabled by default.");
  }
  if (!policy.transcriptGradeTriggers.includes("explicit-user-request")) {
    blockers.push("Transcript-grade preservation must require an explicit user-request trigger.");
  }
  if (policy.auditModeIsCandidateOnly !== true) blockers.push("Audit mode must remain candidate-only.");
  if (policy.normalInteractionLogRequired !== true) blockers.push("Normal interaction logging must remain required.");

  return blockers;
}

export function explainHistoricalChatLogImportPolicyBlockers(policy: HistoricalChatLogImportPolicy): string[] {
  const blockers: string[] = [];

  if (!policy.id) blockers.push("Historical chat log import policy id is required.");
  if (policy.importBelongsToPluginMvp !== false) {
    blockers.push("Historical chat log import must stay outside the plugin MVP.");
  }
  if (policy.historicalLogsAreAuthority !== false) {
    blockers.push("Historical chat logs must remain evidence, not authority.");
  }
  for (const field of ["sourcePath", "checksum", "authorityLevel", "redactionDecision", "currentStateCompatibility"] as const) {
    if (!policy.requiredFields.includes(field)) blockers.push(`Historical chat import requires ${field}.`);
  }
  for (const effect of ["task-creation", "file-write", "checkpoint-change", "state-transition"] as const) {
    if (!policy.forbiddenEffects.includes(effect)) blockers.push(`Historical chat import must forbid ${effect}.`);
  }

  return blockers;
}

export function auditPluginMaturity(input: PluginMaturityAuditInput): PluginMaturityAuditResult {
  const blockers: string[] = [];

  if (!input.hasExtensionManifest) blockers.push("Missing VS Code extension manifest/package contribution metadata.");
  if (!input.hasActivationEntrypoint) blockers.push("Missing VS Code activation entrypoint.");
  if (!input.hasVsCodeCommandRegistration) blockers.push("Missing VS Code command registration adapter.");
  if (!input.hasWebviewViewProviders) blockers.push("Missing native webview view providers.");
  if (!input.hasRuntimeCommandAdapter) blockers.push("Missing adapter from VS Code commands to ThinkIO runtime commands.");
  if (!input.hasBundledViewAssets) blockers.push("Missing bundled plugin view assets.");
  if (!input.hasWorkspaceStatePersistence) blockers.push("Missing workspace-state persistence for plugin UI state.");
  if (!input.hasVsixPackagingScript) blockers.push("Missing VSIX/package build script.");
  if (!input.hasExtensionSmokeTest) blockers.push("Missing VS Code extension smoke test.");

  return {
    matureEnoughForArchitecture: true,
    matureEnoughForUsableVsCodePlugin: blockers.length === 0,
    blockers
  };
}

function commandRoute(
  commandId: PluginCommandId,
  runtimeAction: string,
  mutatesCanonicalState: boolean,
  requiresApproval: boolean,
  producesProposal: boolean
): PluginCommandRoute {
  return {
    commandId,
    runtimeAction,
    mutatesCanonicalState,
    requiresApproval,
    producesProposal
  };
}

function dataProvider(viewKind: PluginViewKind, projectionName: string): PluginViewDataProviderContract {
  return {
    viewKind,
    projectionName,
    refreshCommand: "plugin.refresh-view",
    sourceOfTruth: "runtime-projection"
  };
}

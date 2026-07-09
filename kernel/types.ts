export const TASK_STATUSES = [
  "idea",
  "candidate",
  "accepted",
  "frozen",
  "executable",
  "done",
  "rejected",
  "archived"
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_MODES = [
  "brainstorm",
  "plan",
  "build",
  "review",
  "freeze",
  "execute"
] as const;

export type TaskMode = (typeof TASK_MODES)[number];

export const AUTHORITY_LEVELS = [
  "idea",
  "candidate",
  "accepted",
  "frozen",
  "executable",
  "final",
  "rejected",
  "archived"
] as const;

export type AuthorityLevel = (typeof AUTHORITY_LEVELS)[number];

export const WORKFLOW_POSITIONS = [
  "current",
  "queued-next",
  "deferred",
  "resolved",
  "idea-intake"
] as const;

export type WorkflowPosition = (typeof WORKFLOW_POSITIONS)[number];

export const WORK_STEP_STATUSES = ["open", "blocked", "done", "rejected"] as const;

export type WorkStepStatus = (typeof WORK_STEP_STATUSES)[number];

export interface WorkStep {
  id: string;
  taskId: string;
  title: string;
  workflowPosition: WorkflowPosition;
  status: WorkStepStatus;
  order: number;
  parentStepId?: string;
  artifactLinks: string[];
}

export interface Workboard {
  id: string;
  taskIds: string[];
  steps: WorkStep[];
  updatedAt: string;
}

export const BRANCH_STATUSES = ["active", "paused", "completed", "rejected"] as const;

export type BranchStatus = (typeof BRANCH_STATUSES)[number];

export interface WorkBranch {
  id: string;
  purpose: string;
  status: BranchStatus;
  parentStepId: string;
  activeStepId?: string;
  successCondition: string;
  history: Array<{
    status: BranchStatus;
    at: string;
    note: string;
  }>;
}

export const RETURN_ANCHOR_STATUSES = ["pending", "resolved", "cancelled"] as const;

export type ReturnAnchorStatus = (typeof RETURN_ANCHOR_STATUSES)[number];

export interface ReturnAnchor {
  id: string;
  branchId: string;
  targetStepId: string;
  resumeCondition: string;
  status: ReturnAnchorStatus;
}

export const MODE_POLICY_ACTIONS = [
  "capture-idea",
  "create-proposal",
  "promote-task",
  "write-file",
  "execute-task",
  "ingest-provider-output",
  "freeze-task",
  "review-output"
] as const;

export type ModePolicyAction = (typeof MODE_POLICY_ACTIONS)[number];

export type ValidationStrictness = "loose" | "normal" | "strict" | "locked";
export type IngestionBehavior = "idea-only" | "proposal-only" | "review-required" | "canonical-allowed";

export interface ModePolicy {
  mode: TaskMode;
  allowedActions: ModePolicyAction[];
  validationStrictness: ValidationStrictness;
  ingestionBehavior: IngestionBehavior;
  requiresReviewBeforeLock: boolean;
}

export interface RuntimeReadinessCheck {
  id: string;
  ok: boolean;
  blockers: string[];
}

export interface RuntimeReadinessProof {
  id: string;
  ok: boolean;
  checks: RuntimeReadinessCheck[];
  blockers: string[];
  createdAt: string;
}

export const PROCESS_LEDGER_EVENT_TYPES = [
  "runtime-event",
  "decision",
  "state-transition",
  "validation-outcome"
] as const;

export type ProcessLedgerEventType = (typeof PROCESS_LEDGER_EVENT_TYPES)[number];

export interface ProcessLedgerEntry {
  id: string;
  type: ProcessLedgerEventType;
  taskId?: string;
  stepId?: string;
  branchId?: string;
  artifactIds: string[];
  validationIds: string[];
  message: string;
  createdAt: string;
}

export interface ActiveWorkSlice {
  id: string;
  taskId: string;
  stepId: string;
  branchIds: string[];
  artifactIds: string[];
  contextCardIds: string[];
  validationIds: string[];
  createdAt: string;
  expiresAt?: string;
}

export const CONTEXT_DEPENDENCY_RELATIONSHIPS = [
  "supports",
  "blocks",
  "references",
  "derived-from",
  "conflicts-with"
] as const;

export type ContextDependencyRelationship = (typeof CONTEXT_DEPENDENCY_RELATIONSHIPS)[number];
export type ContextDependencyTargetKind = "source" | "artifact" | "rule" | "task" | "step" | "branch";

export interface ContextDependency {
  id: string;
  fromKind: ContextDependencyTargetKind;
  fromId: string;
  toKind: ContextDependencyTargetKind;
  toId: string;
  relationship: ContextDependencyRelationship;
}

export const CONTEXT_CARD_TYPES = ["rationale", "friction", "warning", "idea", "reference"] as const;

export type ContextCardType = (typeof CONTEXT_CARD_TYPES)[number];
export type ContextCardStatus = "draft" | "attached" | "reviewed" | "promoted" | "rejected";
export type ContextCardPromotionTarget = "deferred-item" | "task" | "rule" | "artifact" | "review-item";

export interface ContextCard {
  id: string;
  type: ContextCardType;
  authority: AuthorityLevel;
  relevance: "low" | "medium" | "high";
  attachment: {
    kind: ContextDependencyTargetKind;
    id: string;
  };
  relationship: ContextDependencyRelationship;
  body: string;
  status: ContextCardStatus;
  promotionTargets: ContextCardPromotionTarget[];
}

export const MODEL_OUTPUT_CLASSES = [
  "informational",
  "hypothesis",
  "recommendation",
  "conflict-signal",
  "correction-candidate",
  "upgrade-candidate",
  "file-action-proposal",
  "rejected",
  "unknown"
] as const;

export type ModelOutputClass = (typeof MODEL_OUTPUT_CLASSES)[number];

export interface ProviderIdentity {
  provider: string;
  model?: string;
  app?: string;
}

export interface ModelInputContract {
  id: string;
  intent: string;
  activeTarget: {
    kind: ContextDependencyTargetKind;
    id: string;
  };
  contextBundle: string[];
  governanceContext: {
    mode: TaskMode;
    authority: AuthorityLevel;
    taskStatus: TaskStatus;
  };
  expectedOutputClasses: ModelOutputClass[];
}

export interface ModelOutputContract {
  id: string;
  inputId: string;
  rawOutput: string;
  normalizedOutput: string;
  outputClass: ModelOutputClass;
  provider: ProviderIdentity;
  warnings: string[];
  proposedActions: string[];
}

export interface NormalizedProviderOutput {
  rawOutput: string;
  normalizedOutput: string;
  outputClass: ModelOutputClass;
  provider: ProviderIdentity;
  warnings: string[];
}

export const GOVERNANCE_ACTION_TYPES = [
  "model-output",
  "board-movement",
  "file-action",
  "state-transition",
  "context-promotion"
] as const;

export type GovernanceActionType = (typeof GOVERNANCE_ACTION_TYPES)[number];
export type ActionSensitivity = "low" | "medium" | "high" | "critical";
export type GovernanceDecisionOutcome = "allow" | "approval-required" | "block" | "defer";

export interface GovernanceDecisionRecord {
  id: string;
  actionType: GovernanceActionType;
  sensitivity: ActionSensitivity;
  outcome: GovernanceDecisionOutcome;
  blockers: string[];
  allowedNextActions: ModePolicyAction[];
  createdAt: string;
}

export const VALIDATION_STAGES = [
  "pre-export",
  "post-export",
  "post-provider",
  "pre-ingest",
  "post-ingest"
] as const;

export type ValidationStage = (typeof VALIDATION_STAGES)[number];

export interface ValidationStageResult {
  id: string;
  stage: ValidationStage;
  ok: boolean;
  blockers: string[];
  governanceDecisionId?: string;
  createdAt: string;
}

export const FILE_ACTION_TYPES = ["read", "create", "update", "delete", "rename", "move", "export", "import"] as const;

export type FileActionType = (typeof FILE_ACTION_TYPES)[number];

export interface FileActionProposal {
  id: string;
  taskId: string;
  action: FileActionType;
  path: string;
  targetPath?: string;
  rationale: string;
  risk: ActionSensitivity;
  requiredApproval: boolean;
  checkpointId?: string;
  rollbackAnchorId?: string;
}

export interface WriterBoundaryDecision {
  proposalId: string;
  outcome: GovernanceDecisionOutcome;
  blockers: string[];
}

export interface CloseoutRecord {
  id: string;
  scope: "task" | "step" | "branch" | "session";
  reason: string;
  taskId: string;
  activeStepId?: string;
  branchId?: string;
  validationRunIds: string[];
  changedArtifactIds: string[];
  rollbackAnchorIds: string[];
  checkpointId: string;
  mutationRollbackIds: string[];
  nextValidAction: ModePolicyAction;
  createdAt: string;
  expiresAt?: string;
}

export interface PackageHistoryManifestEntry {
  path: string;
  hash: string;
  artifactId?: string;
  required: boolean;
}

export interface PackageHistoryManifest {
  id: string;
  version: string;
  entries: PackageHistoryManifestEntry[];
  closeoutId?: string;
  readinessProofId?: string;
  createdAt: string;
}

export interface NativeBoardCard {
  id: string;
  taskId: string;
  title: string;
  lane: WorkflowPosition | TaskStatus;
  order: number;
  authority: AuthorityLevel;
  blockers: string[];
  dependencyIds: string[];
  frictionSignalIds: string[];
}

export interface NativeBoardProjection {
  id: string;
  lanes: Record<string, NativeBoardCard[]>;
  actions: BoardActionContract[];
}

export interface BoardActionContract {
  action: "move-card" | "open-task" | "attach-context" | "request-approval" | "refresh-projection";
  runtimeCommand: string;
  requiresApproval: boolean;
}

export const DERIVATION_CLASSIFICATIONS = ["refinement", "extension", "contradiction", "uncertainty"] as const;

export type DerivationClassification = (typeof DERIVATION_CLASSIFICATIONS)[number];
export type DerivationDecision = "accepted" | "deferred" | "rejected";

export interface DerivationRecord {
  id: string;
  trigger: string;
  sourceRefs: string[];
  targetRefs: string[];
  classification: DerivationClassification;
  affectedLayers: Array<"task" | "rule" | "artifact" | "runtime" | "view" | "contract">;
  validationIds: string[];
  confirmedBy?: string;
  decision: DerivationDecision;
}

export const FRICTION_STATUSES = ["active", "reviewing", "resolved", "deferred", "rejected"] as const;

export type FrictionStatus = (typeof FRICTION_STATUSES)[number];

export interface FrictionSignal {
  id: string;
  observedLocation: string;
  links: string[];
  pattern: string;
  cause: string;
  missingSurface: string;
  risk: ActionSensitivity;
  recommendation: string;
  approvalNeeded: boolean;
  status: FrictionStatus;
  taskId?: string;
  stepId?: string;
  artifactId?: string;
  providerOutputId?: string;
  validationResultId?: string;
}

export type IntakeSourceType = "model-response" | "app-export" | "imported-report" | "generated-artifact";
export type IntakePromotionDecision =
  | "preserve"
  | "defer"
  | "create-derivation"
  | "create-task"
  | "create-proposal"
  | "reject"
  | "promote-after-validation";

export interface IntakeRecord {
  id: string;
  sourceType: IntakeSourceType;
  sourceRef: string;
  outputClass: ModelOutputClass;
  decision: IntakePromotionDecision;
  reviewed: boolean;
  derivationId?: string;
  frictionSignalId?: string;
}

export interface WorkPackage {
  id: string;
  target: "model" | "app" | "human-review";
  mode: TaskMode;
  intent: string;
  expectedOutputClasses: ModelOutputClass[];
  sources: string[];
  excludedSources: string[];
  artifacts: string[];
  rules: string[];
  contextCardIds: string[];
  validationProfile: ValidationStrictness;
  providerTarget: ProviderIdentity;
  taskId?: string;
  stepId?: string;
  createdAt: string;
}

export type ProviderOutputDisposition =
  | "context-card"
  | "deferred-item"
  | "task"
  | "file-action-proposal"
  | "rejected-record"
  | "approved-mutation-path";

export interface ProviderOutputRecord {
  id: string;
  workPackageId: string;
  rawOutputRef: string;
  normalizedOutput: string;
  outputClass: ModelOutputClass;
  warnings: string[];
  proposedActionIds: string[];
  derivationId?: string;
  validationRunIds: string[];
  finalDisposition: ProviderOutputDisposition;
}

export type RuntimeMindmapNodeKind =
  | "task"
  | "step"
  | "source"
  | "artifact"
  | "rule"
  | "context-card"
  | "branch"
  | "work-package"
  | "provider-output"
  | "derivation"
  | "friction"
  | "validation-run";

export type RuntimeMindmapEdgeKind =
  | "depends-on"
  | "derived-from"
  | "validates"
  | "blocks"
  | "attached-to"
  | "exports-to"
  | "ingests-from"
  | "promotes-to";

export interface RuntimeMindmapNode {
  id: string;
  kind: RuntimeMindmapNodeKind;
  label: string;
}

export interface RuntimeMindmapEdge {
  from: string;
  to: string;
  kind: RuntimeMindmapEdgeKind;
}

export interface RuntimeMindmapProjection {
  nodes: RuntimeMindmapNode[];
  edges: RuntimeMindmapEdge[];
}

export type InteractionRequestType =
  | "ask-question"
  | "create-work-package"
  | "review-output"
  | "approve-action"
  | "defer-work"
  | "open-runtime-record";

export type InteractionVisibleState =
  | "draft"
  | "proposal"
  | "blocked"
  | "approval-required"
  | "validated"
  | "ingested"
  | "rejected";

export interface InteractionSurfaceContract {
  id: string;
  allowedRequests: InteractionRequestType[];
  selectedContext: {
    taskId?: string;
    stepId?: string;
    artifactId?: string;
    sourceRef?: string;
    ruleId?: string;
    contextCardId?: string;
  };
  visibleStates: InteractionVisibleState[];
  chatSessionId?: string;
  attachedRuntimeRecordIds: string[];
  chatIsCanonical: false;
}

export interface GovernedTask {
  id: string;
  title: string;
  mode: TaskMode;
  status: TaskStatus;
  authority: AuthorityLevel;
  dependencies: string[];
  allowedContext: string[];
  blockedContext: string[];
  requiredEvidence: string[];
  promotionRule: "all-required-evidence-present";
  checkpointRequired: boolean;
}

export interface ArtifactRecord {
  id: string;
  taskId: string;
  path: string;
  kind: "document" | "schema" | "kernel" | "state" | "view" | "runtime" | "test" | "contract";
  evidence: string[];
  createdAt: string;
  hash?: string;
  dependsOn?: string[];
}

export interface ApprovalRecord {
  id: string;
  taskId: string;
  approvedBy: string;
  scope: string;
  approvedAt: string;
}

export interface CheckpointRecord {
  id: string;
  taskId: string;
  status: TaskStatus;
  evidence: string[];
  notes: string;
  createdAt: string;
}

export interface DeferredItem {
  id: string;
  taskId: string;
  reason: string;
  deferredBy: string;
  deferredAt: string;
  resumeAfter?: string;
  requiredEvidence: string[];
  status: "deferred" | "ready" | "resumed";
}

export interface ExecutionWindow {
  id: string;
  taskId: string;
  opensAt: string;
  closesAt: string;
  timezone: string;
  requiredAuthority: "executable";
}

export interface ArtifactChainManifest {
  id: string;
  taskId: string;
  rootArtifactId: string;
  artifactIds: string[];
  staleArtifactIds: string[];
  createdAt: string;
}

export interface DecompositionRecord {
  id: string;
  parentTaskId: string;
  childTaskIds: string[];
  reason: string;
  preservedDependencies: string[];
  preservedEvidence: string[];
  checkpointIds: string[];
  reconstructionPath: string[];
  createdAt: string;
}

export interface ReplayValidationManifest {
  id: string;
  taskIds: string[];
  requiredStateFiles: string[];
  checkpointIds: string[];
  acceptedArtifactIds: string[];
  artifactChainIds: string[];
  projectGraphNodeIds: string[];
  createdAt: string;
}

export interface MutationTransactionRecord {
  id: string;
  taskId: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  fromAuthority: AuthorityLevel;
  toAuthority: AuthorityLevel;
  evidence: string[];
  ledgerArtifactIds: string[];
  checkpointId: string;
  rollbackStatus: TaskStatus;
  rollbackAuthority: AuthorityLevel;
  createdAt: string;
}

export interface MutationRollbackRecord {
  id: string;
  mutationId: string;
  taskId: string;
  taskPath: string;
  rollbackStatus: TaskStatus;
  rollbackAuthority: AuthorityLevel;
  previousTask: GovernedTask;
  ledgerArtifactIds: string[];
  checkpointId: string;
  appliedAt: string;
}

export interface ContextSourceRule {
  path: string;
  authority: AuthorityLevel;
  modes: TaskMode[];
}

export interface ContextPacket {
  taskId: string;
  mode: TaskMode;
  allowedContext: string[];
  blockedContext: string[];
  includedFiles: string[];
  excludedFiles: string[];
  sourceAuthorities?: Record<string, AuthorityLevel>;
  modeFilteredFiles?: string[];
}

export interface HandoffRecord {
  id: string;
  taskId: string;
  checkpointId: string;
  acceptedDecisions: string[];
  nextValidStep: string;
  resumeContext: string[];
  createdAt: string;
}

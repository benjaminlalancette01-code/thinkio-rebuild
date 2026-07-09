import type {
  ApprovalRecord,
  ArtifactRecord,
  AuthorityLevel,
  CheckpointRecord,
  GovernedTask,
  MutationTransactionRecord,
  TaskStatus,
  ValidationStageResult
} from "../kernel/types.ts";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { createCheckpoint } from "../kernel/checkpoint.ts";
import { buildContextPacket } from "../kernel/context-router.ts";
import {
  createMutationTransactionRecord,
  explainMutationTransactionBlockers
} from "../kernel/mutation-transaction.ts";
import { isAuthorityCompatibleWithStatus } from "../kernel/state-machine.ts";
import { validateCueTargets, validateWorkspaceCueSchemas, type CueCommandRunner, type CueValidationTarget } from "./cue-validator.ts";
import { isAllowedLocalDevAction } from "./command-registry.ts";
import {
  applyMutationTransactionToWorkspace,
  type MutationTransactionApplyInput,
  type MutationTransactionApplyResult
} from "./mutation-applier.ts";
import { buildRuntimeReadinessProof, type RuntimeReadinessInput } from "../kernel/runtime-readiness.ts";
import {
  evaluateGovernanceDecision,
  type GovernanceDecisionInput
} from "../kernel/governance-decision.ts";
import { collectValidationBlockers } from "../kernel/validation-loop.ts";
import { evaluateWriterBoundary } from "../kernel/file-action.ts";
import { buildNativeBoardProjection, buildRuntimeMindmapProjection } from "../kernel/runtime-projections.ts";
import { validateWorkPackage } from "../kernel/work-package.ts";
import { validateProviderOutputIngest } from "../kernel/provider-output-ingest.ts";
import { validateInteractionSurfaceContract } from "../kernel/interaction-surface.ts";
import { updateViewFiles } from "./update-views.ts";

export const approvalRequiredLocalDevActions = [
  "apply-mutation-transaction",
  "plan-mutation-transaction",
  "write-checkpoint"
] as const;

export type ApprovalRequiredLocalDevAction = (typeof approvalRequiredLocalDevActions)[number];

export interface ApprovalStateFile {
  approvals?: ApprovalRecord[];
}

export interface MutationTransactionPlanInput {
  task: GovernedTask;
  toStatus: TaskStatus;
  toAuthority: AuthorityLevel;
  evidence: string[];
  ledgerArtifactIds: string[];
  checkpointId: string;
  ledgerEntries: ArtifactRecord[];
  checkpoints: CheckpointRecord[];
  approvals: ApprovalRecord[];
  rollbackStatus?: TaskStatus;
  rollbackAuthority?: AuthorityLevel;
  id?: string;
  createdAt?: string;
}

export interface JsonTaskValidationResult {
  file: string;
  ok: boolean;
  taskId?: string;
  errors: string[];
}

export interface TaskTransitionStateValidationResult {
  taskId: string;
  ok: boolean;
  blockers: string[];
}

export interface RuntimeCommandResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

export type RuntimeCommandRunner = (
  command: string,
  args: string[]
) => Promise<RuntimeCommandResult>;

export function assertLocalDevActionAllowed(action: string): void {
  if (!isAllowedLocalDevAction(action)) {
    throw new Error(`Local dev runtime action blocked: ${action}`);
  }
}

export function isApprovalRequiredForLocalDevAction(
  action: string
): action is ApprovalRequiredLocalDevAction {
  return approvalRequiredLocalDevActions.includes(action as ApprovalRequiredLocalDevAction);
}

export function approvalScopeForLocalDevAction(action: ApprovalRequiredLocalDevAction): string {
  return `local-dev:${action}`;
}

export function validateApprovalRecord(
  approval: ApprovalRecord,
  expectedTaskId?: string,
  expectedScope?: string
): boolean {
  if (!approval.id || !approval.id.startsWith("APR-")) {
    return false;
  }

  if (!approval.taskId || (expectedTaskId && approval.taskId !== expectedTaskId)) {
    return false;
  }

  if (!approval.scope || (expectedScope && approval.scope !== expectedScope)) {
    return false;
  }

  return Boolean(approval.approvedBy) && Boolean(Date.parse(approval.approvedAt));
}

export function findApprovalForLocalDevAction(
  approvals: ApprovalRecord[],
  task: GovernedTask,
  action: ApprovalRequiredLocalDevAction
): ApprovalRecord | undefined {
  const scope = approvalScopeForLocalDevAction(action);
  return approvals.find((approval) => validateApprovalRecord(approval, task.id, scope));
}

export function explainApprovalBoundaryBlockers(
  task: GovernedTask,
  action: string,
  approvals: ApprovalRecord[]
): string[] {
  if (!isApprovalRequiredForLocalDevAction(action)) {
    return [];
  }

  if (findApprovalForLocalDevAction(approvals, task, action)) {
    return [];
  }

  return [`Missing approval for ${task.id} scope ${approvalScopeForLocalDevAction(action)}.`];
}

export function assertApprovalBoundarySatisfied(
  task: GovernedTask,
  action: string,
  approvals: ApprovalRecord[]
): void {
  const [blocker] = explainApprovalBoundaryBlockers(task, action, approvals);

  if (blocker) {
    throw new Error(`Approval boundary blocked: ${blocker}`);
  }
}

export async function readApprovalState(
  approvalPath = "state/approvals.json"
): Promise<ApprovalRecord[]> {
  try {
    const parsed = JSON.parse(await readFile(approvalPath, "utf8")) as ApprovalStateFile;
    return parsed.approvals ?? [];
  } catch (error) {
    if (isMissingFileError(error)) {
      return [];
    }
    throw error;
  }
}

export async function explainApprovalBoundaryBlockersFromState(
  task: GovernedTask,
  action: string,
  approvalPath?: string
): Promise<string[]> {
  return explainApprovalBoundaryBlockers(task, action, await readApprovalState(approvalPath));
}

export async function assertApprovalBoundarySatisfiedFromState(
  task: GovernedTask,
  action: string,
  approvalPath?: string
): Promise<void> {
  const approvals = await readApprovalState(approvalPath);
  assertApprovalBoundarySatisfied(task, action, approvals);
}

export function buildTaskRuntimePreview(
  task: GovernedTask,
  evidence: string[],
  approvals: ApprovalRecord[] = []
) {
  assertLocalDevActionAllowed("build-context-packet");
  assertLocalDevActionAllowed("write-checkpoint");
  assertApprovalBoundarySatisfied(task, "write-checkpoint", approvals);

  return {
    contextPacket: buildContextPacket(task),
    checkpoint: createCheckpoint({ task, evidence })
  };
}

export function buildRuntimeReadiness(input: RuntimeReadinessInput) {
  assertLocalDevActionAllowed("build-runtime-readiness-proof");
  return buildRuntimeReadinessProof(input);
}

export function evaluateRuntimeGovernanceDecision(input: GovernanceDecisionInput) {
  assertLocalDevActionAllowed("evaluate-governance-decision");
  return evaluateGovernanceDecision(input);
}

export function collectRuntimeValidationBlockers(results: ValidationStageResult[]): string[] {
  assertLocalDevActionAllowed("collect-validation-blockers");
  return collectValidationBlockers(results);
}

export function evaluateRuntimeFileActionProposal(
  ...args: Parameters<typeof evaluateWriterBoundary>
): ReturnType<typeof evaluateWriterBoundary> {
  assertLocalDevActionAllowed("evaluate-file-action-proposal");
  return evaluateWriterBoundary(...args);
}

export function buildRuntimeNativeBoardProjection(
  ...args: Parameters<typeof buildNativeBoardProjection>
): ReturnType<typeof buildNativeBoardProjection> {
  assertLocalDevActionAllowed("build-native-board-projection");
  return buildNativeBoardProjection(...args);
}

export function buildRuntimeMindmapDependencyProjection(
  ...args: Parameters<typeof buildRuntimeMindmapProjection>
): ReturnType<typeof buildRuntimeMindmapProjection> {
  assertLocalDevActionAllowed("build-runtime-mindmap-projection");
  return buildRuntimeMindmapProjection(...args);
}

export function validateRuntimeWorkPackage(
  ...args: Parameters<typeof validateWorkPackage>
): ReturnType<typeof validateWorkPackage> {
  assertLocalDevActionAllowed("validate-work-package");
  return validateWorkPackage(...args);
}

export function validateRuntimeProviderOutputIngest(
  ...args: Parameters<typeof validateProviderOutputIngest>
): ReturnType<typeof validateProviderOutputIngest> {
  assertLocalDevActionAllowed("validate-provider-output-ingest");
  return validateProviderOutputIngest(...args);
}

export function validateRuntimeInteractionSurface(
  ...args: Parameters<typeof validateInteractionSurfaceContract>
): ReturnType<typeof validateInteractionSurfaceContract> {
  assertLocalDevActionAllowed("validate-interaction-surface");
  return validateInteractionSurfaceContract(...args);
}

export async function buildTaskRuntimePreviewFromState(
  task: GovernedTask,
  evidence: string[],
  approvalPath?: string
) {
  return buildTaskRuntimePreview(task, evidence, await readApprovalState(approvalPath));
}

export function planMutationTransaction(input: MutationTransactionPlanInput) {
  assertLocalDevActionAllowed("plan-mutation-transaction");
  assertApprovalBoundarySatisfied(input.task, "plan-mutation-transaction", input.approvals);

  const transaction = createMutationTransactionRecord({
    task: input.task,
    toStatus: input.toStatus,
    toAuthority: input.toAuthority,
    evidence: input.evidence,
    ledgerArtifactIds: input.ledgerArtifactIds,
    checkpointId: input.checkpointId,
    rollbackStatus: input.rollbackStatus,
    rollbackAuthority: input.rollbackAuthority,
    id: input.id,
    createdAt: input.createdAt
  });
  const blockers = explainMutationTransactionBlockers(
    transaction,
    input.task,
    input.ledgerEntries,
    input.checkpoints
  );

  return {
    transaction,
    ok: blockers.length === 0,
    blockers
  };
}

export async function planMutationTransactionFromState(
  input: Omit<MutationTransactionPlanInput, "approvals"> & { approvalPath?: string }
) {
  const { approvalPath, ...planInput } = input;
  return planMutationTransaction({
    ...planInput,
    approvals: await readApprovalState(approvalPath)
  });
}

export async function applyMutationTransaction(
  input: MutationTransactionApplyInput & { approvals: ApprovalRecord[] }
): Promise<MutationTransactionApplyResult> {
  assertLocalDevActionAllowed("apply-mutation-transaction");
  assertApprovalBoundarySatisfied(
    { id: input.transaction.taskId } as GovernedTask,
    "apply-mutation-transaction",
    input.approvals
  );

  return applyMutationTransactionToWorkspace(input);
}

export async function applyMutationTransactionFromState(
  input: MutationTransactionApplyInput & { approvalPath?: string }
): Promise<MutationTransactionApplyResult> {
  return applyMutationTransaction({
    ...input,
    approvals: await readApprovalState(input.approvalPath)
  });
}

export async function validateJsonTaskFiles(tasksDir = "tasks"): Promise<JsonTaskValidationResult[]> {
  assertLocalDevActionAllowed("validate-json-task-files");
  const entries = await readdir(tasksDir, { withFileTypes: true });
  const taskFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => join(tasksDir, entry.name))
    .sort((a, b) => a.localeCompare(b));

  return Promise.all(taskFiles.map(validateJsonTaskFile));
}

export function validateTaskTransitionStates(
  tasks: GovernedTask[]
): TaskTransitionStateValidationResult[] {
  assertLocalDevActionAllowed("validate-transitions");

  return tasks.map((task) => {
    const blockers: string[] = [];

    if (!isAuthorityCompatibleWithStatus(task.authority, task.status)) {
      blockers.push(`Task authority ${task.authority} is not compatible with status ${task.status}.`);
    }

    return {
      taskId: task.id,
      ok: blockers.length === 0,
      blockers
    };
  });
}

export async function runLocalTests(
  runner: RuntimeCommandRunner = runCommand
): Promise<RuntimeCommandResult> {
  assertLocalDevActionAllowed("run-tests");
  return runner("npm", ["test"]);
}

export async function validateWorkspaceSchemas(
  targets?: CueValidationTarget[],
  runner?: CueCommandRunner
) {
  assertLocalDevActionAllowed("validate-cue-schemas");

  if (!targets) {
    return validateWorkspaceCueSchemas("tasks", runner);
  }

  return validateCueTargets(targets, runner);
}

export async function updateWorkspaceViews(): Promise<void> {
  assertLocalDevActionAllowed("update-views");
  await updateViewFiles();
}

async function validateJsonTaskFile(file: string): Promise<JsonTaskValidationResult> {
  try {
    const task = JSON.parse(await readFile(file, "utf8")) as Partial<GovernedTask>;
    const errors: string[] = [];

    for (const field of [
      "id",
      "title",
      "mode",
      "status",
      "authority",
      "dependencies",
      "allowedContext",
      "blockedContext",
      "requiredEvidence",
      "promotionRule",
      "checkpointRequired"
    ] as const) {
      if (!(field in task)) {
        errors.push(`Missing field: ${field}.`);
      }
    }

    return {
      file,
      ok: errors.length === 0,
      taskId: task.id,
      errors
    };
  } catch (error) {
    return {
      file,
      ok: false,
      errors: [error instanceof Error ? error.message : String(error)]
    };
  }
}

function runCommand(command: string, args: string[]): Promise<RuntimeCommandResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      shell: process.platform === "win32"
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("close", (exitCode) => {
      resolve({ exitCode, stdout, stderr });
    });
    child.on("error", (error) => {
      resolve({ exitCode: null, stdout, stderr: error.message });
    });
  });
}

function isMissingFileError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

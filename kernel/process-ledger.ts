import type { ActiveWorkSlice, ProcessLedgerEntry, ValidationStageResult, Workboard, WorkBranch } from "./types.ts";
import { findCurrentStep } from "./workboard.ts";

type ProcessLedgerInput = Omit<ProcessLedgerEntry, "id" | "createdAt"> &
  Partial<Pick<ProcessLedgerEntry, "id" | "createdAt">>;

export function createProcessLedgerEntry(input: ProcessLedgerInput): ProcessLedgerEntry {
  return {
    id: input.id ?? `PROC-${Date.now()}`,
    type: input.type,
    taskId: input.taskId,
    stepId: input.stepId,
    branchId: input.branchId,
    artifactIds: [...input.artifactIds],
    validationIds: [...input.validationIds],
    message: input.message,
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function appendProcessLedgerEntry(
  entries: ProcessLedgerEntry[],
  entry: ProcessLedgerEntry
): ProcessLedgerEntry[] {
  return [...entries, entry];
}

export function createActiveWorkSlice(input: {
  id?: string;
  workboard: Workboard;
  branches?: WorkBranch[];
  contextCardIds?: string[];
  validationResults?: ValidationStageResult[];
  createdAt?: string;
  expiresAt?: string;
}): ActiveWorkSlice {
  const currentStep = findCurrentStep(input.workboard);

  if (!currentStep) {
    throw new Error("Cannot create active work slice without a current step.");
  }

  return {
    id: input.id ?? `SLICE-${currentStep.id}`,
    taskId: currentStep.taskId,
    stepId: currentStep.id,
    branchIds: (input.branches ?? [])
      .filter((branch) => branch.parentStepId === currentStep.id || branch.activeStepId === currentStep.id)
      .map((branch) => branch.id),
    artifactIds: [...currentStep.artifactLinks],
    contextCardIds: [...(input.contextCardIds ?? [])],
    validationIds: (input.validationResults ?? []).map((result) => result.id),
    createdAt: input.createdAt ?? new Date().toISOString(),
    expiresAt: input.expiresAt
  };
}

export function explainActiveWorkSliceBlockers(
  slice: ActiveWorkSlice,
  activeSlices: ActiveWorkSlice[] = [],
  at = new Date()
): string[] {
  const blockers: string[] = [];

  if (!slice.taskId) {
    blockers.push(`Active work slice ${slice.id} requires a task id.`);
  }

  if (!slice.stepId) {
    blockers.push(`Active work slice ${slice.id} requires a step id.`);
  }

  if (!Boolean(Date.parse(slice.createdAt))) {
    blockers.push(`Active work slice ${slice.id} createdAt must be a valid date.`);
  }

  if (slice.expiresAt && Date.parse(slice.expiresAt) <= at.getTime()) {
    blockers.push(`Active work slice ${slice.id} is stale.`);
  }

  const conflicting = activeSlices.find(
    (candidate) => candidate.id !== slice.id && candidate.taskId === slice.taskId && candidate.stepId !== slice.stepId
  );
  if (conflicting) {
    blockers.push(`Active work slice ${slice.id} conflicts with ${conflicting.id} for task ${slice.taskId}.`);
  }

  return blockers;
}

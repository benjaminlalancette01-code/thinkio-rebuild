import { randomUUID } from "node:crypto";
import type { CheckpointRecord, GovernedTask, HandoffRecord, TaskStatus } from "./types.ts";

interface CheckpointInput {
  task: GovernedTask;
  evidence: string[];
  notes?: string;
  id?: string;
  createdAt?: string;
}

export function createCheckpoint(input: CheckpointInput): CheckpointRecord {
  return {
    id: input.id ?? `CHK-${randomUUID()}`,
    taskId: input.task.id,
    status: input.task.status,
    evidence: [...input.evidence],
    notes: input.notes ?? "",
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function validateCheckpoint(
  checkpoint: CheckpointRecord,
  expectedTaskId?: string,
  expectedStatus?: TaskStatus
): boolean {
  if (!checkpoint.id || !checkpoint.id.startsWith("CHK-")) {
    return false;
  }

  if (!checkpoint.taskId || (expectedTaskId && checkpoint.taskId !== expectedTaskId)) {
    return false;
  }

  if (expectedStatus && checkpoint.status !== expectedStatus) {
    return false;
  }

  return Array.isArray(checkpoint.evidence) && Boolean(Date.parse(checkpoint.createdAt));
}

export function createHandoff(input: {
  task: GovernedTask;
  checkpoint: CheckpointRecord;
  acceptedDecisions: string[];
  nextValidStep: string;
  resumeContext: string[];
  id?: string;
  createdAt?: string;
}): HandoffRecord {
  return {
    id: input.id ?? `HANDOFF-${input.task.id}`,
    taskId: input.task.id,
    checkpointId: input.checkpoint.id,
    acceptedDecisions: [...input.acceptedDecisions],
    nextValidStep: input.nextValidStep,
    resumeContext: [...input.resumeContext],
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function validateHandoff(handoff: HandoffRecord, checkpoint: CheckpointRecord): boolean {
  if (!handoff.id || !handoff.id.startsWith("HANDOFF-")) {
    return false;
  }

  if (handoff.taskId !== checkpoint.taskId || handoff.checkpointId !== checkpoint.id) {
    return false;
  }

  if (!handoff.nextValidStep || handoff.resumeContext.length === 0) {
    return false;
  }

  return Boolean(Date.parse(handoff.createdAt));
}

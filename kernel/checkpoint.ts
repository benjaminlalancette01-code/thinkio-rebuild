import { randomUUID } from "node:crypto";
import type { CheckpointRecord, GovernedTask, TaskStatus } from "./types.ts";

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


import type { CloseoutRecord } from "./types.ts";

export function createCloseoutRecord(input: CloseoutRecord): CloseoutRecord {
  return {
    ...input,
    validationRunIds: [...input.validationRunIds],
    changedArtifactIds: [...input.changedArtifactIds],
    rollbackAnchorIds: [...input.rollbackAnchorIds],
    mutationRollbackIds: [...input.mutationRollbackIds]
  };
}

export function explainCloseoutBlockers(closeout: CloseoutRecord, at = new Date()): string[] {
  const blockers: string[] = [];

  if (!closeout.scope) {
    blockers.push(`Closeout ${closeout.id} requires scope.`);
  }

  if (!closeout.reason.trim()) {
    blockers.push(`Closeout ${closeout.id} requires a reason.`);
  }

  if (!closeout.taskId) {
    blockers.push(`Closeout ${closeout.id} requires a task id.`);
  }

  if (!closeout.checkpointId) {
    blockers.push(`Closeout ${closeout.id} requires a checkpoint link.`);
  }

  if (closeout.changedArtifactIds.length > 0 && closeout.rollbackAnchorIds.length === 0) {
    blockers.push(`Closeout ${closeout.id} changed artifacts but has no rollback anchor.`);
  }

  if (closeout.validationRunIds.length === 0) {
    blockers.push(`Closeout ${closeout.id} requires at least one validation run.`);
  }

  if (!Boolean(Date.parse(closeout.createdAt))) {
    blockers.push(`Closeout ${closeout.id} createdAt must be a valid date.`);
  }

  if (closeout.expiresAt && Date.parse(closeout.expiresAt) <= at.getTime()) {
    blockers.push(`Closeout ${closeout.id} is stale.`);
  }

  return blockers;
}

export function validateCloseoutRecord(closeout: CloseoutRecord): boolean {
  return explainCloseoutBlockers(closeout).length === 0;
}

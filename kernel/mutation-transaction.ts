import { canPromoteTask } from "./gate.ts";
import {
  isAuthorityCompatibleWithStatus,
  isAuthorityTransitionAllowed,
  isTransitionAllowed
} from "./state-machine.ts";
import type {
  ArtifactRecord,
  AuthorityLevel,
  CheckpointRecord,
  GovernedTask,
  MutationTransactionRecord,
  TaskStatus
} from "./types.ts";

interface MutationTransactionInput {
  task: GovernedTask;
  toStatus: TaskStatus;
  toAuthority: AuthorityLevel;
  evidence: string[];
  ledgerArtifactIds: string[];
  checkpointId: string;
  rollbackStatus?: TaskStatus;
  rollbackAuthority?: AuthorityLevel;
  id?: string;
  createdAt?: string;
}

export function createMutationTransactionRecord(input: MutationTransactionInput): MutationTransactionRecord {
  return {
    id: input.id ?? `MUT-${input.task.id}`,
    taskId: input.task.id,
    fromStatus: input.task.status,
    toStatus: input.toStatus,
    fromAuthority: input.task.authority,
    toAuthority: input.toAuthority,
    evidence: [...input.evidence],
    ledgerArtifactIds: [...input.ledgerArtifactIds],
    checkpointId: input.checkpointId,
    rollbackStatus: input.rollbackStatus ?? input.task.status,
    rollbackAuthority: input.rollbackAuthority ?? input.task.authority,
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function validateMutationTransaction(
  record: MutationTransactionRecord,
  task: GovernedTask,
  ledgerEntries: ArtifactRecord[],
  checkpoints: CheckpointRecord[]
): boolean {
  return explainMutationTransactionBlockers(record, task, ledgerEntries, checkpoints).length === 0;
}

export function explainMutationTransactionBlockers(
  record: MutationTransactionRecord,
  task: GovernedTask,
  ledgerEntries: ArtifactRecord[],
  checkpoints: CheckpointRecord[]
): string[] {
  const reasons: string[] = [];
  const artifactsById = new Map(ledgerEntries.map((artifact) => [artifact.id, artifact]));
  const checkpointsById = new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));

  if (!record.id || !record.id.startsWith("MUT-")) {
    reasons.push("Mutation transaction id must start with MUT-.");
  }

  if (record.taskId !== task.id) {
    reasons.push(`Mutation transaction belongs to ${record.taskId}, not ${task.id}.`);
  }

  if (record.fromStatus !== task.status) {
    reasons.push(`Mutation fromStatus ${record.fromStatus} does not match task status ${task.status}.`);
  }

  if (record.fromAuthority !== task.authority) {
    reasons.push(`Mutation fromAuthority ${record.fromAuthority} does not match task authority ${task.authority}.`);
  }

  if (!isTransitionAllowed(record.fromStatus, record.toStatus)) {
    reasons.push(`Task transition blocked: ${record.fromStatus} -> ${record.toStatus}.`);
  }

  if (!isAuthorityTransitionAllowed(record.fromAuthority, record.toAuthority)) {
    reasons.push(`Authority transition blocked: ${record.fromAuthority} -> ${record.toAuthority}.`);
  }

  if (!isAuthorityCompatibleWithStatus(record.toAuthority, record.toStatus)) {
    reasons.push(`Target authority ${record.toAuthority} is not compatible with status ${record.toStatus}.`);
  }

  if (!canPromoteTask(task, record.evidence)) {
    const missingEvidence = task.requiredEvidence.filter((required) => !record.evidence.includes(required));
    for (const missing of missingEvidence) {
      reasons.push(`Missing mutation evidence: ${missing}.`);
    }
  }

  if (record.ledgerArtifactIds.length === 0) {
    reasons.push("Mutation transaction must include at least one ledger artifact effect.");
  }

  for (const artifactId of record.ledgerArtifactIds) {
    const artifact = artifactsById.get(artifactId);

    if (!artifact) {
      reasons.push(`Missing ledger artifact: ${artifactId}.`);
      continue;
    }

    if (artifact.taskId !== task.id) {
      reasons.push(`Ledger artifact ${artifactId} belongs to ${artifact.taskId}, not ${task.id}.`);
    }
  }

  if (task.checkpointRequired && !record.checkpointId) {
    reasons.push("Checkpoint-required task must include a checkpoint effect.");
  }

  if (record.checkpointId) {
    const checkpoint = checkpointsById.get(record.checkpointId);

    if (!checkpoint) {
      reasons.push(`Missing checkpoint: ${record.checkpointId}.`);
    } else {
      if (checkpoint.taskId !== task.id) {
        reasons.push(`Checkpoint ${record.checkpointId} belongs to ${checkpoint.taskId}, not ${task.id}.`);
      }

      if (checkpoint.status !== record.toStatus) {
        reasons.push(`Checkpoint ${record.checkpointId} status ${checkpoint.status} does not match target status ${record.toStatus}.`);
      }
    }
  }

  if (!isTransitionAllowed(record.rollbackStatus, record.toStatus)) {
    reasons.push(`Rollback status ${record.rollbackStatus} cannot reconstruct target status ${record.toStatus}.`);
  }

  if (!isAuthorityTransitionAllowed(record.rollbackAuthority, record.toAuthority)) {
    reasons.push(`Rollback authority ${record.rollbackAuthority} cannot reconstruct target authority ${record.toAuthority}.`);
  }

  if (!isAuthorityCompatibleWithStatus(record.rollbackAuthority, record.rollbackStatus)) {
    reasons.push(`Rollback authority ${record.rollbackAuthority} is not compatible with status ${record.rollbackStatus}.`);
  }

  if (!Date.parse(record.createdAt)) {
    reasons.push("Mutation transaction createdAt must be a valid date.");
  }

  return reasons;
}

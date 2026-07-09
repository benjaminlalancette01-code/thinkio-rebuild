import type { CheckpointRecord, DecompositionRecord, GovernedTask } from "./types.ts";

interface DecompositionInput {
  parentTask: GovernedTask;
  childTasks: GovernedTask[];
  reason: string;
  id?: string;
  preservedDependencies?: string[];
  preservedEvidence?: string[];
  checkpointIds?: string[];
  reconstructionPath?: string[];
  createdAt?: string;
}

export function createDecompositionRecord(input: DecompositionInput): DecompositionRecord {
  const childTaskIds = input.childTasks.map((task) => task.id);

  return {
    id: input.id ?? `DEC-${input.parentTask.id}`,
    parentTaskId: input.parentTask.id,
    childTaskIds,
    reason: input.reason,
    preservedDependencies: [...(input.preservedDependencies ?? input.parentTask.dependencies)],
    preservedEvidence: [...(input.preservedEvidence ?? input.parentTask.requiredEvidence)],
    checkpointIds: [...(input.checkpointIds ?? [])],
    reconstructionPath: [...(input.reconstructionPath ?? [input.parentTask.id, ...childTaskIds])],
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function validateDecomposition(
  record: DecompositionRecord,
  tasks: GovernedTask[],
  checkpoints: CheckpointRecord[] = []
): boolean {
  return explainDecompositionBlockers(record, tasks, checkpoints).length === 0;
}

export function explainDecompositionBlockers(
  record: DecompositionRecord,
  tasks: GovernedTask[],
  checkpoints: CheckpointRecord[] = []
): string[] {
  const reasons: string[] = [];
  const tasksById = new Map(tasks.map((task) => [task.id, task]));
  const parentTask = tasksById.get(record.parentTaskId);
  const childTaskIds = new Set(record.childTaskIds);

  if (!record.id || !record.id.startsWith("DEC-")) {
    reasons.push("Decomposition record id must start with DEC-.");
  }

  if (!parentTask) {
    reasons.push(`Parent task not found: ${record.parentTaskId}.`);
  }

  if (record.childTaskIds.length === 0) {
    reasons.push("Decomposition must name at least one child task.");
  }

  if (childTaskIds.size !== record.childTaskIds.length) {
    reasons.push("Decomposition child task ids must be unique.");
  }

  if (childTaskIds.has(record.parentTaskId)) {
    reasons.push("Parent task cannot be its own decomposition child.");
  }

  const childTasks = record.childTaskIds
    .map((id) => tasksById.get(id))
    .filter((task): task is GovernedTask => Boolean(task));

  for (const childTaskId of record.childTaskIds) {
    if (!tasksById.has(childTaskId)) {
      reasons.push(`Child task not found: ${childTaskId}.`);
    }
  }

  if (parentTask) {
    for (const dependency of parentTask.dependencies) {
      if (!record.preservedDependencies.includes(dependency)) {
        reasons.push(`Missing preserved dependency: ${dependency}.`);
      }

      for (const childTask of childTasks) {
        if (!childTask.dependencies.includes(dependency)) {
          reasons.push(`Child task ${childTask.id} does not preserve dependency ${dependency}.`);
        }
      }
    }

    for (const dependency of record.preservedDependencies) {
      if (!parentTask.dependencies.includes(dependency)) {
        reasons.push(`Preserved dependency is not on parent task: ${dependency}.`);
      }
    }

    const childEvidence = new Set(childTasks.flatMap((task) => task.requiredEvidence));
    for (const evidence of parentTask.requiredEvidence) {
      if (!record.preservedEvidence.includes(evidence)) {
        reasons.push(`Missing preserved evidence: ${evidence}.`);
      }

      if (!childEvidence.has(evidence)) {
        reasons.push(`No child task preserves evidence requirement ${evidence}.`);
      }
    }

    for (const evidence of record.preservedEvidence) {
      if (!parentTask.requiredEvidence.includes(evidence)) {
        reasons.push(`Preserved evidence is not on parent task: ${evidence}.`);
      }
    }

    if (parentTask.checkpointRequired && record.checkpointIds.length === 0) {
      reasons.push("Checkpoint-required parent task must keep checkpoint lineage.");
    }
  }

  if (checkpoints.length > 0) {
    const checkpointIds = new Set(checkpoints.map((checkpoint) => checkpoint.id));
    for (const checkpointId of record.checkpointIds) {
      if (!checkpointIds.has(checkpointId)) {
        reasons.push(`Checkpoint not found: ${checkpointId}.`);
      }
    }
  }

  if (record.reconstructionPath[0] !== record.parentTaskId) {
    reasons.push("Reconstruction path must start with the parent task id.");
  }

  for (const childTaskId of record.childTaskIds) {
    if (!record.reconstructionPath.includes(childTaskId)) {
      reasons.push(`Reconstruction path does not include child task ${childTaskId}.`);
    }
  }

  if (!record.reason) {
    reasons.push("Decomposition reason is required.");
  }

  if (!Date.parse(record.createdAt)) {
    reasons.push("Decomposition createdAt must be a valid date.");
  }

  return reasons;
}

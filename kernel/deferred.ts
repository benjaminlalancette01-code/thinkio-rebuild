import type { DeferredItem, GovernedTask } from "./types.ts";

type DeferredInput = Omit<DeferredItem, "status"> & Partial<Pick<DeferredItem, "status">>;

export function createDeferredItem(input: DeferredInput): DeferredItem {
  return {
    ...input,
    requiredEvidence: [...input.requiredEvidence],
    status: input.status ?? "deferred"
  };
}

export function canResumeDeferredItem(item: DeferredItem, evidence: string[], at = new Date()): boolean {
  if (item.status === "resumed") {
    return false;
  }

  if (item.resumeAfter && Date.parse(item.resumeAfter) > at.getTime()) {
    return false;
  }

  return item.requiredEvidence.every((required) => evidence.includes(required));
}

export function explainDeferredBlockers(item: DeferredItem, evidence: string[], at = new Date()): string[] {
  const reasons: string[] = [];

  if (item.status === "resumed") {
    reasons.push("Deferred item has already resumed.");
  }

  if (item.resumeAfter && Date.parse(item.resumeAfter) > at.getTime()) {
    reasons.push(`Deferred item cannot resume before ${item.resumeAfter}.`);
  }

  const missingEvidence = item.requiredEvidence.filter((required) => !evidence.includes(required));
  for (const missing of missingEvidence) {
    reasons.push(`Missing resume evidence: ${missing}.`);
  }

  return reasons;
}

export function createDeferredItemForTask(
  task: GovernedTask,
  reason: string,
  deferredBy: string,
  options: {
    id?: string;
    deferredAt?: string;
    resumeAfter?: string;
    requiredEvidence?: string[];
  } = {}
): DeferredItem {
  return createDeferredItem({
    id: options.id ?? `DEF-${task.id}`,
    taskId: task.id,
    reason,
    deferredBy,
    deferredAt: options.deferredAt ?? new Date().toISOString(),
    resumeAfter: options.resumeAfter,
    requiredEvidence: options.requiredEvidence ?? task.requiredEvidence
  });
}

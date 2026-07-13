import type { GovernedTask } from "./types.ts";
import type { CapabilityRecord } from "./capability-registry.ts";
import type { HistoricalTranslationRecord } from "./historical-translation.ts";

export interface CrossLayerValidationInput {
  tasks: GovernedTask[];
  capabilityRecords: CapabilityRecord[];
  historicalTranslations: HistoricalTranslationRecord[];
  docs: Array<{ path: string; text: string }>;
}

export interface CrossLayerValidationResult {
  contradictions: string[];
  conceptLoss: string[];
  ok: boolean;
}

export function validateCrossLayerConsistency(input: CrossLayerValidationInput): CrossLayerValidationResult {
  const taskIds = new Set(input.tasks.map((task) => task.id));
  const capabilityIds = new Set(input.capabilityRecords.map((capability) => capability.id));
  const contradictions: string[] = [];
  const conceptLoss: string[] = [];

  for (const capability of input.capabilityRecords) {
    for (const taskId of capability.taskIds) {
      if (!taskIds.has(taskId)) contradictions.push(`Capability ${capability.id} references missing task ${taskId}.`);
    }
  }

  for (const translation of input.historicalTranslations) {
    for (const taskId of translation.taskIds) {
      if (!taskIds.has(taskId)) contradictions.push(`Historical translation ${translation.id} references missing task ${taskId}.`);
    }
    if (translation.disposition === "valid-gap" && translation.taskIds.length === 0) {
      conceptLoss.push(`Valid historical gap ${translation.id} has no mapped task.`);
    }
    if (translation.capabilityId && !capabilityIds.has(translation.capabilityId)) {
      conceptLoss.push(`Historical translation ${translation.id} maps to missing capability ${translation.capabilityId}.`);
    }
  }

  for (const doc of input.docs) {
    const matches = doc.text.match(/TASK-\d{3}/g) ?? [];
    for (const taskId of matches) {
      if (!taskIds.has(taskId)) contradictions.push(`Document ${doc.path} references missing task ${taskId}.`);
    }
  }

  return {
    contradictions,
    conceptLoss,
    ok: contradictions.length === 0 && conceptLoss.length === 0
  };
}

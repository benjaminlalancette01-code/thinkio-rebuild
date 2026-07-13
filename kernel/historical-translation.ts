export type HistoricalTranslationDisposition =
  | "already-native"
  | "valid-gap"
  | "partial-native"
  | "superseded"
  | "external-skill-only"
  | "rejected";

export type SkillDisposition = "active-external" | "native-replacement" | "superseded" | "deferred" | "rejected";

export interface HistoricalTranslationRecord {
  id: string;
  archiveConcept: string;
  sourceRefs: string[];
  currentNativeDestination: string;
  disposition: HistoricalTranslationDisposition;
  evidence: string[];
  taskIds: string[];
  capabilityId?: string;
  supersededBy?: string;
}

export interface SkillDispositionRecord {
  skillName: string;
  disposition: SkillDisposition;
  nativeReplacementTaskIds: string[];
  rationale: string;
}

export function explainHistoricalTranslationBlockers(record: HistoricalTranslationRecord): string[] {
  const blockers: string[] = [];
  if (!record.archiveConcept.trim()) blockers.push(`Historical translation ${record.id} requires archive concept.`);
  if (record.sourceRefs.length === 0) blockers.push(`Historical translation ${record.id} requires archive source mapping.`);
  if (!record.currentNativeDestination.trim()) blockers.push(`Historical translation ${record.id} requires native destination.`);
  if (record.disposition === "valid-gap" && record.taskIds.length === 0) {
    blockers.push(`Historical translation ${record.id} is a valid gap and requires a task.`);
  }
  if (record.disposition === "superseded" && !record.supersededBy) {
    blockers.push(`Historical translation ${record.id} is superseded and requires supersession target.`);
  }
  return blockers;
}

export function classifySkillDisposition(record: SkillDispositionRecord): string[] {
  const blockers: string[] = [];
  if (record.disposition === "native-replacement" && record.nativeReplacementTaskIds.length === 0) {
    blockers.push(`Skill ${record.skillName} needs native replacement task ids.`);
  }
  if (!record.rationale.trim()) blockers.push(`Skill ${record.skillName} requires rationale.`);
  return blockers;
}

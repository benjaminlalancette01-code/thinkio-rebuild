export type ReentryNativeOwner = "project-materials" | "kernel" | "runtime" | "cue" | "baml" | "extension-command" | "report" | "external-skill";

export interface ReentryResponsibilityMapping {
  historicalResponsibility: string;
  nativeOwner: ReentryNativeOwner;
  reads: string[];
  writes: string[];
  validationEvidence: string[];
  coveredByTaskIds: string[];
}

export function explainReentryTranslationBlockers(mappings: ReentryResponsibilityMapping[]): string[] {
  const blockers: string[] = [];
  const responsibilities = new Set(mappings.map((mapping) => mapping.historicalResponsibility));
  const required = [
    "required-load-list",
    "active-reentry-prompt",
    "cross-chat-carry-forward",
    "package-manifest-checksum",
    "model-continuation-rules",
    "accepted-project-mutation"
  ];

  for (const item of required) {
    if (!responsibilities.has(item)) blockers.push(`Reentry responsibility map is missing ${item}.`);
  }

  for (const mapping of mappings) {
    if (mapping.validationEvidence.length === 0) {
      blockers.push(`Reentry mapping ${mapping.historicalResponsibility} requires validation evidence.`);
    }
    if (mapping.nativeOwner === "baml" && mapping.writes.some((target) => target.startsWith("state/"))) {
      blockers.push(`BAML mapping ${mapping.historicalResponsibility} cannot write canonical state directly.`);
    }
  }

  return blockers;
}

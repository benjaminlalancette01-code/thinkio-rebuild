export type ExportReadinessPurpose = "model-review" | "archive-research" | "release" | "vsix-install" | "handoff";
export type VersionProfileKind = "product" | "runtime" | "state" | "checkpoint" | "export" | "extension" | "archive-lineage";

export interface ExportReadinessProfile {
  id: string;
  purpose: ExportReadinessPurpose;
  requiredSources: string[];
  excludedSources: string[];
  requiredValidation: string[];
  expectedIngestPath: string;
}

export interface StorageReliabilityReview {
  id: string;
  paths: Array<{ path: string; exists: boolean; portable: boolean; checksum?: string }>;
}

export interface VersionProfile {
  kind: VersionProfileKind;
  version: string;
  sourceRef: string;
}

export function explainExportReadinessBlockers(input: {
  profile: ExportReadinessProfile;
  storage: StorageReliabilityReview;
  versions: VersionProfile[];
  passedValidation: string[];
}): string[] {
  const blockers: string[] = [];
  for (const source of input.profile.requiredSources) {
    const path = input.storage.paths.find((item) => item.path === source);
    if (!path?.exists) blockers.push(`Export source is missing: ${source}.`);
    if (path && !path.portable) blockers.push(`Export source is not portable: ${source}.`);
  }
  for (const validation of input.profile.requiredValidation) {
    if (!input.passedValidation.includes(validation)) blockers.push(`Export validation missing: ${validation}.`);
  }
  if (!input.profile.expectedIngestPath.trim()) blockers.push(`Export profile ${input.profile.id} requires expected ingest path.`);
  if (!input.versions.some((version) => version.kind === "export")) blockers.push("Export version profile is required.");
  return blockers;
}

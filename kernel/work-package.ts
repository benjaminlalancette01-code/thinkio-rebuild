import type { WorkPackage } from "./types.ts";

export function createWorkPackage(input: WorkPackage): WorkPackage {
  return {
    ...input,
    expectedOutputClasses: [...input.expectedOutputClasses],
    sources: [...input.sources],
    excludedSources: [...input.excludedSources],
    artifacts: [...input.artifacts],
    rules: [...input.rules],
    contextCardIds: [...input.contextCardIds]
  };
}

export function explainWorkPackageBlockers(workPackage: WorkPackage): string[] {
  const blockers: string[] = [];

  if (!workPackage.intent.trim()) {
    blockers.push(`Work package ${workPackage.id} requires intent.`);
  }

  if (workPackage.expectedOutputClasses.length === 0) {
    blockers.push(`Work package ${workPackage.id} requires expected output classes.`);
  }

  if (workPackage.sources.length === 0 && workPackage.artifacts.length === 0 && workPackage.contextCardIds.length === 0) {
    blockers.push(`Work package ${workPackage.id} requires bounded context.`);
  }

  if (workPackage.sources.some((source) => source.includes("archive/"))) {
    blockers.push(`Work package ${workPackage.id} includes blocked archive source.`);
  }

  for (const excludedSource of workPackage.excludedSources) {
    if (workPackage.sources.includes(excludedSource)) {
      blockers.push(`Work package ${workPackage.id} includes and excludes ${excludedSource}.`);
    }
  }

  if (!Boolean(Date.parse(workPackage.createdAt))) {
    blockers.push(`Work package ${workPackage.id} createdAt must be a valid date.`);
  }

  return blockers;
}

export function validateWorkPackage(workPackage: WorkPackage): boolean {
  return explainWorkPackageBlockers(workPackage).length === 0;
}

import type { ProviderOutputDisposition, ProviderOutputRecord, WorkPackage } from "./types.ts";

export function chooseProviderOutputDisposition(output: ProviderOutputRecord): ProviderOutputDisposition {
  if (output.outputClass === "rejected") return "rejected-record";
  if (output.outputClass === "conflict-signal" || output.outputClass === "unknown") return "deferred-item";
  if (output.outputClass === "file-action-proposal") return "file-action-proposal";
  if (output.outputClass === "correction-candidate" || output.outputClass === "upgrade-candidate") return "task";
  return "context-card";
}

export function explainProviderOutputIngestBlockers(
  output: ProviderOutputRecord,
  workPackage: WorkPackage
): string[] {
  const blockers: string[] = [];

  if (output.workPackageId !== workPackage.id) {
    blockers.push(`Provider output ${output.id} does not match work package ${workPackage.id}.`);
  }

  if (!workPackage.expectedOutputClasses.includes(output.outputClass)) {
    blockers.push(`Provider output ${output.id} class ${output.outputClass} was not expected by ${workPackage.id}.`);
  }

  if (!output.rawOutputRef) {
    blockers.push(`Provider output ${output.id} requires a raw output reference.`);
  }

  if (!output.normalizedOutput.trim()) {
    blockers.push(`Provider output ${output.id} requires normalized output.`);
  }

  if (output.finalDisposition !== chooseProviderOutputDisposition(output)) {
    blockers.push(`Provider output ${output.id} final disposition does not match governance route.`);
  }

  return blockers;
}

export function validateProviderOutputIngest(output: ProviderOutputRecord, workPackage: WorkPackage): boolean {
  return explainProviderOutputIngestBlockers(output, workPackage).length === 0;
}

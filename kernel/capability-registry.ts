export type CapabilityNativeHome = "schema" | "kernel" | "runtime" | "baml" | "command" | "view" | "test" | "docs" | "external-skill";
export type CapabilityMaturity = "idea" | "candidate" | "implemented" | "validated" | "stable";

export interface CapabilityRecord {
  id: string;
  name: string;
  nativeHome: CapabilityNativeHome;
  maturity: CapabilityMaturity;
  taskIds: string[];
  evidence: string[];
  blockers: string[];
  externalSkill?: string;
}

export interface CapabilityPromotionResult {
  ok: boolean;
  nextMaturity: CapabilityMaturity;
  blockers: string[];
}

export function explainCapabilityBlockers(capability: CapabilityRecord): string[] {
  const blockers: string[] = [];
  if (!capability.id.trim()) blockers.push("Capability requires id.");
  if (!capability.name.trim()) blockers.push(`Capability ${capability.id} requires name.`);
  if (capability.taskIds.length === 0 && capability.nativeHome !== "external-skill") {
    blockers.push(`Capability ${capability.id} requires at least one task.`);
  }
  if (capability.nativeHome === "external-skill" && !capability.externalSkill) {
    blockers.push(`Capability ${capability.id} requires external skill id.`);
  }
  blockers.push(...capability.blockers);
  return blockers;
}

export function promoteCapability(capability: CapabilityRecord, requiredEvidence: string[]): CapabilityPromotionResult {
  const missing = requiredEvidence.filter((item) => !capability.evidence.includes(item));
  const blockers = [...explainCapabilityBlockers(capability), ...missing.map((item) => `Missing capability evidence: ${item}.`)];
  const nextMaturity = blockers.length > 0 ? capability.maturity : nextMaturityAfter(capability.maturity);
  return { ok: blockers.length === 0, nextMaturity, blockers };
}

export function buildCapabilityProjection(capabilities: CapabilityRecord[]) {
  return {
    capabilities: capabilities.map((capability) => ({
      id: capability.id,
      name: capability.name,
      nativeHome: capability.nativeHome,
      maturity: capability.maturity,
      blockers: explainCapabilityBlockers(capability)
    }))
  };
}

function nextMaturityAfter(maturity: CapabilityMaturity): CapabilityMaturity {
  if (maturity === "idea") return "candidate";
  if (maturity === "candidate") return "implemented";
  if (maturity === "implemented") return "validated";
  return "stable";
}

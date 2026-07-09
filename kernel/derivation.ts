import type { DerivationDecision, DerivationRecord } from "./types.ts";

export function explainDerivationBlockers(derivation: DerivationRecord): string[] {
  const blockers: string[] = [];

  if (!derivation.id) {
    blockers.push("Derivation id is required.");
  }

  if (!derivation.trigger.trim()) {
    blockers.push(`Derivation ${derivation.id} requires a trigger.`);
  }

  if (derivation.sourceRefs.length === 0) {
    blockers.push(`Derivation ${derivation.id} requires source refs.`);
  }

  if (derivation.targetRefs.length === 0) {
    blockers.push(`Derivation ${derivation.id} requires target refs.`);
  }

  if (derivation.affectedLayers.length === 0) {
    blockers.push(`Derivation ${derivation.id} requires affected layers.`);
  }

  if (derivation.decision === "accepted" && !derivation.confirmedBy) {
    blockers.push(`Accepted derivation ${derivation.id} requires confirmation.`);
  }

  return blockers;
}

export function validateDerivationRecord(derivation: DerivationRecord): boolean {
  return explainDerivationBlockers(derivation).length === 0;
}

export function routeDerivationDecision(derivation: Pick<DerivationRecord, "classification">): DerivationDecision {
  if (derivation.classification === "contradiction") {
    return "deferred";
  }

  if (derivation.classification === "uncertainty") {
    return "deferred";
  }

  return "accepted";
}

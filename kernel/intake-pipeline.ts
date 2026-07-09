import type { IntakePromotionDecision, IntakeRecord, ModelOutputClass } from "./types.ts";

export function classifyExternalOutput(raw: string): ModelOutputClass {
  const lower = raw.toLowerCase();

  if (lower.includes("irrelevant")) return "rejected";
  if (lower.includes("conflict") || lower.includes("contradiction")) return "conflict-signal";
  if (lower.includes("correction")) return "correction-candidate";
  if (lower.includes("upgrade")) return "upgrade-candidate";
  if (lower.includes("recommend")) return "recommendation";
  if (lower.includes("hypothesis")) return "hypothesis";
  return "informational";
}

export function chooseIntakePromotionDecision(outputClass: ModelOutputClass, reviewed: boolean): IntakePromotionDecision {
  if (outputClass === "rejected") return "reject";
  if (outputClass === "conflict-signal") return "defer";
  if (outputClass === "correction-candidate" || outputClass === "upgrade-candidate") {
    return reviewed ? "create-derivation" : "promote-after-validation";
  }
  if (outputClass === "recommendation") return "create-proposal";
  return "preserve";
}

export function explainIntakeBlockers(record: IntakeRecord): string[] {
  const blockers: string[] = [];

  if (!record.id) blockers.push("Intake record id is required.");
  if (!record.sourceRef) blockers.push(`Intake record ${record.id} requires a source ref.`);

  if (record.decision === "create-derivation" && !record.derivationId) {
    blockers.push(`Intake record ${record.id} requires a derivation link.`);
  }

  if (record.decision === "promote-after-validation" && record.reviewed) {
    blockers.push(`Intake record ${record.id} is already reviewed and should use a concrete promotion decision.`);
  }

  return blockers;
}

export function validateIntakeRecord(record: IntakeRecord): boolean {
  return explainIntakeBlockers(record).length === 0;
}

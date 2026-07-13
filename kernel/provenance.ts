import type { ActionSensitivity, GovernanceDecisionRecord } from "./types.ts";

export type OriginKind = "task" | "doc" | "archive" | "model-output" | "runtime" | "external-skill";
export type ImpactLayer = "task" | "state" | "schema" | "kernel" | "runtime" | "baml" | "extension" | "docs" | "views";

export interface OriginProvenanceRecord {
  id: string;
  kind: OriginKind;
  sourceRef: string;
  derivedFrom: string[];
  authority: "canonical" | "generated" | "historical" | "proposal";
}

export interface ImpactClassification {
  sensitivity: ActionSensitivity;
  layers: ImpactLayer[];
  requiresApproval: boolean;
}

export interface ExplainableGateResult {
  id: string;
  decision: GovernanceDecisionRecord;
  provenance: OriginProvenanceRecord[];
  impact: ImpactClassification;
  explanation: string;
}

export function classifyImpact(layers: ImpactLayer[]): ImpactClassification {
  const unique = [...new Set(layers)];
  const canonicalImpact = unique.some((layer) => ["task", "state", "schema", "kernel", "runtime", "baml"].includes(layer));
  const sensitivity: ActionSensitivity = canonicalImpact
    ? (unique.some((layer) => ["schema", "runtime", "baml"].includes(layer)) ? "high" : "medium")
    : "low";

  return {
    sensitivity,
    layers: unique,
    requiresApproval: sensitivity !== "low"
  };
}

export function buildExplainableGateResult(input: {
  id: string;
  decision: GovernanceDecisionRecord;
  provenance: OriginProvenanceRecord[];
  impact: ImpactClassification;
}): ExplainableGateResult {
  const origins = input.provenance.map((item) => `${item.kind}:${item.sourceRef}`).join(", ");
  const layers = input.impact.layers.join(", ");

  return {
    ...input,
    explanation: `${input.decision.outcome} because ${input.decision.blockers.length} blocker(s) were found; origins=[${origins}], impact=[${layers}].`
  };
}

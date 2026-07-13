export const REQUIRED_MODEL_FACING_BAML_CONTRACTS = [
  "build-context-packet.baml",
  "classify-task.baml",
  "detect-drift.baml",
  "review-evidence.baml",
  "classify-project-material.baml",
  "route-task-context.baml",
  "verify-proof-package.baml",
  "summarize-human-review.baml",
  "propose-refactor-batch.baml",
  "compose-task-proposal.baml",
  "classify-provider-output.baml",
  "review-governance-decision.baml",
  "translate-reentry-responsibility.baml"
] as const;

export interface BamlCliBoundaryDecision {
  contractsDirectory: "contracts/baml";
  bamlSrcDirectory?: "baml_src";
  generatedClientAllowed: boolean;
  providerIntegrationReady: boolean;
  rationale: string;
}

export function validateBamlContractInventory(input: {
  files: string[];
  rootContractFiles?: string[];
  cliBoundary: BamlCliBoundaryDecision;
}): string[] {
  const blockers: string[] = [];
  const files = new Set(input.files);

  for (const required of REQUIRED_MODEL_FACING_BAML_CONTRACTS) {
    if (!files.has(required)) blockers.push(`Missing BAML contract ${required}.`);
  }

  for (const file of input.rootContractFiles ?? []) {
    if (file.endsWith(".baml")) blockers.push(`BAML contract ${file} must live under contracts/baml.`);
  }

  if (input.cliBoundary.generatedClientAllowed && !input.cliBoundary.bamlSrcDirectory) {
    blockers.push("Generated BAML client requires an explicit baml_src boundary.");
  }
  if (input.cliBoundary.providerIntegrationReady && !input.cliBoundary.generatedClientAllowed) {
    blockers.push("Provider integration cannot be ready before generated client boundary is allowed.");
  }
  if (!input.cliBoundary.rationale.trim()) blockers.push("BAML CLI boundary decision requires rationale.");

  return blockers;
}

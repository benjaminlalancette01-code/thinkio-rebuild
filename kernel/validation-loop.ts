import { VALIDATION_STAGES, type GovernanceDecisionRecord, type ValidationStage, type ValidationStageResult } from "./types.ts";

type ValidationStageInput = Omit<ValidationStageResult, "id" | "createdAt"> &
  Partial<Pick<ValidationStageResult, "id" | "createdAt">>;

export function createValidationStageResult(input: ValidationStageInput): ValidationStageResult {
  return {
    id: input.id ?? `VAL-${input.stage}`,
    stage: input.stage,
    ok: input.ok,
    blockers: [...input.blockers],
    governanceDecisionId: input.governanceDecisionId,
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function validateValidationStageOrder(results: ValidationStageResult[]): boolean {
  return explainValidationStageOrderBlockers(results).length === 0;
}

export function explainValidationStageOrderBlockers(results: ValidationStageResult[]): string[] {
  const blockers: string[] = [];
  let lastIndex = -1;

  for (const result of results) {
    const index = VALIDATION_STAGES.indexOf(result.stage);

    if (index === -1) {
      blockers.push(`Unknown validation stage: ${result.stage}.`);
      continue;
    }

    if (index < lastIndex) {
      blockers.push(`Validation stage ${result.stage} appears after a later stage.`);
    }

    lastIndex = Math.max(lastIndex, index);

    if (!Boolean(Date.parse(result.createdAt))) {
      blockers.push(`Validation result ${result.id} createdAt must be a valid date.`);
    }
  }

  return blockers;
}

export function collectValidationBlockers(results: ValidationStageResult[]): string[] {
  return [
    ...explainValidationStageOrderBlockers(results),
    ...results.flatMap((result) => result.blockers)
  ];
}

export function connectValidationToGovernance(
  result: ValidationStageResult,
  decision: GovernanceDecisionRecord
): ValidationStageResult {
  return {
    ...result,
    governanceDecisionId: decision.id
  };
}

export function shouldRefreshViewsAfterValidation(results: ValidationStageResult[]): boolean {
  const last = results.at(-1);
  return Boolean(last && last.stage === "post-ingest" && last.ok && collectValidationBlockers(results).length === 0);
}

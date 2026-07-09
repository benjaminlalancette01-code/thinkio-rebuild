import type { ModePolicy, ModePolicyAction, ModelOutputClass, TaskMode, TaskStatus } from "./types.ts";

export const modePolicies: Record<TaskMode, ModePolicy> = {
  brainstorm: {
    mode: "brainstorm",
    allowedActions: ["capture-idea", "create-proposal"],
    validationStrictness: "loose",
    ingestionBehavior: "idea-only",
    requiresReviewBeforeLock: true
  },
  plan: {
    mode: "plan",
    allowedActions: ["capture-idea", "create-proposal", "promote-task", "review-output"],
    validationStrictness: "normal",
    ingestionBehavior: "proposal-only",
    requiresReviewBeforeLock: true
  },
  build: {
    mode: "build",
    allowedActions: ["write-file", "ingest-provider-output", "review-output"],
    validationStrictness: "strict",
    ingestionBehavior: "review-required",
    requiresReviewBeforeLock: true
  },
  review: {
    mode: "review",
    allowedActions: ["review-output", "promote-task", "freeze-task"],
    validationStrictness: "strict",
    ingestionBehavior: "review-required",
    requiresReviewBeforeLock: true
  },
  freeze: {
    mode: "freeze",
    allowedActions: ["review-output", "freeze-task"],
    validationStrictness: "locked",
    ingestionBehavior: "review-required",
    requiresReviewBeforeLock: true
  },
  execute: {
    mode: "execute",
    allowedActions: ["execute-task", "write-file", "ingest-provider-output"],
    validationStrictness: "locked",
    ingestionBehavior: "canonical-allowed",
    requiresReviewBeforeLock: false
  }
};

export interface ModePolicyEvaluationInput {
  mode: TaskMode;
  action: ModePolicyAction;
  targetStatus?: TaskStatus;
  evidence?: string[];
}

export function getModePolicy(mode: TaskMode): ModePolicy {
  return modePolicies[mode];
}

export function explainModePolicyBlockers(input: ModePolicyEvaluationInput): string[] {
  const policy = getModePolicy(input.mode);
  const blockers: string[] = [];

  if (!policy.allowedActions.includes(input.action)) {
    blockers.push(`Mode ${input.mode} does not allow action ${input.action}.`);
  }

  if (
    policy.requiresReviewBeforeLock &&
    input.targetStatus &&
    ["frozen", "executable"].includes(input.targetStatus) &&
    !(input.evidence ?? []).includes("review-before-lock-complete")
  ) {
    blockers.push(`Mode ${input.mode} requires review-before-lock evidence before ${input.targetStatus}.`);
  }

  return blockers;
}

export function routeExploratoryOutput(
  mode: TaskMode,
  outputClass: ModelOutputClass
): "idea" | "deferred" | "proposal" | "canonical" {
  const policy = getModePolicy(mode);

  if (policy.ingestionBehavior === "canonical-allowed" && outputClass !== "unknown") {
    return "canonical";
  }

  if (outputClass === "conflict-signal" || outputClass === "unknown") {
    return "deferred";
  }

  if (policy.ingestionBehavior === "idea-only") {
    return "idea";
  }

  return "proposal";
}

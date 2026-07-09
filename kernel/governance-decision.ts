import type {
  ActionSensitivity,
  GovernanceActionType,
  GovernanceDecisionRecord,
  ModelOutputClass,
  ModePolicyAction,
  TaskMode,
  TaskStatus,
  AuthorityLevel
} from "./types.ts";
import { explainModePolicyBlockers, getModePolicy } from "./mode-policy.ts";
import { isAuthorityCompatibleWithStatus } from "./state-machine.ts";

export interface GovernanceDecisionInput {
  id?: string;
  actionType: GovernanceActionType;
  action: ModePolicyAction;
  sensitivity: ActionSensitivity;
  mode: TaskMode;
  status: TaskStatus;
  authority: AuthorityLevel;
  validationBlockers?: string[];
  outputClass?: ModelOutputClass;
  taskId?: string;
  scopeTaskId?: string;
  evidence?: string[];
  createdAt?: string;
}

export function evaluateGovernanceDecision(input: GovernanceDecisionInput): GovernanceDecisionRecord {
  const blockers = explainGovernanceBlockers(input);
  const outcome = chooseOutcome(input, blockers);

  return {
    id: input.id ?? `GOV-${input.actionType}`,
    actionType: input.actionType,
    sensitivity: input.sensitivity,
    outcome,
    blockers,
    allowedNextActions: [...getModePolicy(input.mode).allowedActions],
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function explainGovernanceBlockers(input: GovernanceDecisionInput): string[] {
  const blockers = [
    ...explainModePolicyBlockers({
      mode: input.mode,
      action: input.action,
      targetStatus: input.action === "freeze-task" ? "frozen" : undefined,
      evidence: input.evidence
    }),
    ...(input.validationBlockers ?? [])
  ];

  if (!isAuthorityCompatibleWithStatus(input.authority, input.status)) {
    blockers.push(`Authority ${input.authority} is not compatible with status ${input.status}.`);
  }

  if (input.taskId && input.scopeTaskId && input.taskId !== input.scopeTaskId) {
    blockers.push(`Action scope ${input.scopeTaskId} does not match task ${input.taskId}.`);
  }

  if (input.outputClass === "rejected") {
    blockers.push("Rejected provider output cannot be accepted.");
  }

  return blockers;
}

function chooseOutcome(
  input: GovernanceDecisionInput,
  blockers: string[]
): GovernanceDecisionRecord["outcome"] {
  if (blockers.length > 0) {
    return input.outputClass === "conflict-signal" || input.outputClass === "unknown" ? "defer" : "block";
  }

  if (input.sensitivity === "high" || input.sensitivity === "critical") {
    return "approval-required";
  }

  if (input.outputClass === "conflict-signal" || input.outputClass === "unknown") {
    return "defer";
  }

  return "allow";
}

import type { GovernanceDecisionRecord, InteractionSurfaceContract, InteractionVisibleState } from "./types.ts";

export function visibleStateForGovernanceDecision(decision: GovernanceDecisionRecord): InteractionVisibleState {
  if (decision.outcome === "block") return "blocked";
  if (decision.outcome === "approval-required") return "approval-required";
  if (decision.outcome === "defer") return "proposal";
  return "validated";
}

export function explainInteractionSurfaceBlockers(contract: InteractionSurfaceContract): string[] {
  const blockers: string[] = [];

  if (!contract.id) {
    blockers.push("Interaction surface contract id is required.");
  }

  if (contract.allowedRequests.length === 0) {
    blockers.push(`Interaction surface ${contract.id} requires allowed requests.`);
  }

  if (contract.visibleStates.length === 0) {
    blockers.push(`Interaction surface ${contract.id} requires visible states.`);
  }

  if (contract.chatIsCanonical !== false) {
    blockers.push(`Interaction surface ${contract.id} must keep chat non-canonical.`);
  }

  if (contract.chatSessionId && contract.attachedRuntimeRecordIds.length === 0) {
    blockers.push(`Interaction surface ${contract.id} chat session must attach to runtime records.`);
  }

  return blockers;
}

export function validateInteractionSurfaceContract(contract: InteractionSurfaceContract): boolean {
  return explainInteractionSurfaceBlockers(contract).length === 0;
}

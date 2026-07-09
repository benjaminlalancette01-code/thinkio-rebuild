export function buildGovernanceResultViewModel(result = {}) {
  const blockers = Array.isArray(result.blockers) ? result.blockers : [];
  const status = result.status ?? (result.ok ? "ok" : "blocked");
  const proposalId = result.proposal?.id;

  return {
    state: status,
    title: titleForStatus(status),
    commandId: result.commandId,
    runtimeAction: result.runtimeAction,
    blockers,
    proposalId,
    approvalRequired: status === "approval-required",
    reviewable: status === "proposal-created" || status === "approval-required" || blockers.length > 0
  };
}

function titleForStatus(status) {
  if (status === "proposal-created") return "Proposal Created";
  if (status === "approval-required") return "Approval Required";
  if (status === "blocked") return "Blocked";
  if (status === "deferred-pending-write") return "Deferred";
  if (status === "applied") return "Applied";
  return "Validated";
}

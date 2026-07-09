import type { ApprovalRecord, FileActionProposal, WriterBoundaryDecision } from "./types.ts";

const writeActions = new Set<FileActionProposal["action"]>(["create", "update", "delete", "rename", "move", "export", "import"]);

export function classifyFileActionRisk(action: FileActionProposal["action"], path: string): FileActionProposal["risk"] {
  if (action === "delete" || action === "move" || action === "rename") {
    return "critical";
  }

  if (path.startsWith("tasks/") || path.startsWith("state/") || path.startsWith("kernel/")) {
    return action === "read" ? "medium" : "high";
  }

  return action === "read" ? "low" : "medium";
}

export function explainFileActionProposalBlockers(
  proposal: FileActionProposal,
  approvals: ApprovalRecord[] = []
): string[] {
  const blockers: string[] = [];

  if (!proposal.id) {
    blockers.push("File action proposal id is required.");
  }

  if (!proposal.taskId) {
    blockers.push(`File action proposal ${proposal.id} requires a task id.`);
  }

  if (!proposal.path) {
    blockers.push(`File action proposal ${proposal.id} requires a path.`);
  }

  if (["rename", "move"].includes(proposal.action) && !proposal.targetPath) {
    blockers.push(`File action proposal ${proposal.id} requires a target path for ${proposal.action}.`);
  }

  if (writeActions.has(proposal.action) && !proposal.checkpointId) {
    blockers.push(`File action proposal ${proposal.id} requires a checkpoint link.`);
  }

  if (["delete", "rename", "move", "update"].includes(proposal.action) && !proposal.rollbackAnchorId) {
    blockers.push(`File action proposal ${proposal.id} requires a rollback anchor.`);
  }

  if (proposal.requiredApproval && !approvals.some((approval) => approval.taskId === proposal.taskId)) {
    blockers.push(`File action proposal ${proposal.id} requires approval for task ${proposal.taskId}.`);
  }

  return blockers;
}

export function evaluateWriterBoundary(
  proposal: FileActionProposal,
  approvals: ApprovalRecord[] = []
): WriterBoundaryDecision {
  const blockers = explainFileActionProposalBlockers(proposal, approvals);

  if (blockers.length > 0) {
    return { proposalId: proposal.id, outcome: "block", blockers };
  }

  if (proposal.requiredApproval && ["high", "critical"].includes(proposal.risk)) {
    return { proposalId: proposal.id, outcome: "approval-required", blockers: [] };
  }

  return { proposalId: proposal.id, outcome: "allow", blockers: [] };
}

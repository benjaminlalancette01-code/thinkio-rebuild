// Boundary contract: explain a governance decision for human review.
review_governance_decision(decision_json: string) -> {
  outcome: "allow" | "approval-required" | "block" | "defer",
  blocker_summary: string,
  approval_reason: string,
  next_valid_action: string
}

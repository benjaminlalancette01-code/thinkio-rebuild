// Boundary contract: propose a refactor batch as reviewable work, never direct writes.
propose_refactor_batch(scope: string, changed_files: string[]) -> {
  proposal_title: string,
  affected_files: string[],
  risks: string[],
  required_approvals: string[],
  validation_plan: string[]
}

// Boundary contract: convert runtime composer text into a governed task proposal.
compose_task_proposal(input: string, current_project_state: string) -> {
  title: string,
  mode: "brainstorm" | "plan" | "build" | "review" | "freeze" | "execute",
  dependencies: string[],
  required_evidence: string[],
  blocked_context: string[]
}

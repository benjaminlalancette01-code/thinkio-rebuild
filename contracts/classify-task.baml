// Boundary contract: classify loose input into a governed task draft.
classify_task(input: string) -> {
  title: string,
  mode: "brainstorm" | "plan" | "build" | "review" | "freeze" | "execute",
  candidate_status: "idea" | "candidate",
  required_evidence: string[]
}


// Boundary contract: review whether supplied evidence satisfies task requirements.
review_evidence(task_json: string, evidence: string[]) -> {
  satisfied: bool,
  missing: string[],
  notes: string
}


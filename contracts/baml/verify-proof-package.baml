// Boundary contract: review a proof package; ThinkIO still validates evidence natively.
verify_proof_package(task_json: string, evidence_refs: string[], validation_refs: string[]) -> {
  satisfied: bool,
  missing_evidence: string[],
  weak_evidence: string[],
  notes: string
}

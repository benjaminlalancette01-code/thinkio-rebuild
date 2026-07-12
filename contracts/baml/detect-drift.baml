// Boundary contract: detect drift between task authority, implementation, and state.
detect_drift(task_json: string, changed_files: string[]) -> {
  drift_detected: bool,
  affected_authority: string[],
  recommended_action: string
}


// Boundary contract: classify provider output before native ingestion.
classify_provider_output(raw_output: string) -> {
  output_class: "informational" | "hypothesis" | "recommendation" | "conflict-signal" | "correction-candidate" | "upgrade-candidate" | "file-action-proposal" | "rejected" | "unknown",
  warnings: string[],
  proposed_actions: string[]
}

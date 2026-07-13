// Boundary contract: translate old reentry language into current ThinkIO native owners.
translate_reentry_responsibility(source_excerpt: string) -> {
  historical_responsibility: string,
  native_owner: "project-materials" | "kernel" | "runtime" | "cue" | "baml" | "extension-command" | "report" | "external-skill",
  reads: string[],
  writes: string[],
  validation_evidence: string[]
}

// Boundary contract: classify project material without granting authority.
classify_project_material(path: string, excerpt: string) -> {
  disposition: "canonical-source" | "current-guidance" | "generated-state" | "historical-evidence" | "imported-evidence" | "visual-mirror" | "runtime-support" | "stale-superseded" | "review-needed" | "rejected-reference",
  authority: "canonical" | "current" | "generated" | "historical" | "imported" | "mirror" | "support",
  rationale: string
}

// Boundary contract: summarize human review without creating canonical state.
summarize_human_review(review_notes: string, task_json: string) -> {
  summary: string,
  decisions: string[],
  unresolved_questions: string[],
  proposed_next_actions: string[]
}

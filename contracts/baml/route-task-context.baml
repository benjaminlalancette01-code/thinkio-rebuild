// Boundary contract: route context for a task while preserving archive exclusions.
route_task_context(task_json: string, requested_mode: string) -> {
  include_paths: string[],
  exclude_paths: string[],
  historical_paths: string[],
  authority_warning: string
}

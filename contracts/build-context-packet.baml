// Boundary contract: propose a bounded context packet for a governed task.
build_context_packet(task_json: string) -> {
  task_id: string,
  included_files: string[],
  excluded_files: string[],
  archive_material_excluded: bool
}


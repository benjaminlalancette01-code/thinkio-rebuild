# Geometry Projection Boundary

Legacy geometry vocabulary may be used only as optional view metadata.

Geometry must not define task authority, task status, promotion, execution, governance decisions, or writer-boundary behavior. It can be used as a visual hint if a future view needs layout metadata, but the kernel must remain governed by explicit task/runtime records.

## Decision

Do not add geometry fields to governed task state now.

If geometry becomes useful for visual exploration, it should live in generated view metadata or a documented view adapter. It must remain disposable and derivable from canonical runtime state.

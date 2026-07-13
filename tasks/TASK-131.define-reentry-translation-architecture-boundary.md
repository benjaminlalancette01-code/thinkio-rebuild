# TASK-131: Define Reentry Translation Architecture Boundary

Plan how historical ThinkIO reentry behavior translates into the current plugin-first native architecture.

## Required Work

- Inventory the reentry responsibilities from v1.1.1 and newer recovery reports.
- Map each responsibility to native owner: project material workflow, kernel, runtime, CUE, BAML, extension command/view, export profile, report, or external skill.
- Define which parts are already covered by TASK-120, TASK-121, TASK-122, TASK-126, and TASK-129.
- Define which model-facing parts require BAML contracts and which local validation parts require CUE/runtime logic.
- Produce implementation adjustments or follow-up tasks only after the translation boundary is explicit.

# Deprecated Skill Translation Classification - 2026-07-12

## Current Library Snapshot

Active local skills already include:

- `attitude-tech-writer`
- `chat-length-guard`
- `naming-convention-enforcer`
- `project-master-updater`
- `skill-library-reviewer`
- `skill-opportunity-auditor`
- `skill-trigger-auditor`
- `variant-decision-helper`

The archived v3 skill bundle included 23 packages:

`analyze-project-experiment`, `artifact-packager`, `attitude-tech-writer`, `block-classifier`, `brainstorm-project`, `chat-length-guard`, `connect-modules`, `execution-handoff`, `extract-skill-from-workflow`, `naming-convention-enforcer`, `organize-modules`, `prioritize-scope`, `project-master-updater`, `project-stack-orchestrator`, `project-support-router`, `refine-module`, `review-project-loop`, `skill-library-reviewer`, `skill-opportunity-auditor`, `skill-trigger-auditor`, `ui-detail-planner`, `ui-flow-planner`, `variant-decision-helper`.

## Classification

| Archived skill | Disposition |
| --- | --- |
| attitude-tech-writer | already active external skill |
| chat-length-guard | already active external skill |
| naming-convention-enforcer | already active external skill; native registry still needed by `TASK-127` |
| project-master-updater | already active external skill |
| skill-library-reviewer | already active external skill; native capability registry needed by `TASK-123` |
| skill-opportunity-auditor | already active external skill; native promotion loop needed by `TASK-123` |
| skill-trigger-auditor | already active external skill; native promotion loop needed by `TASK-123` |
| variant-decision-helper | already active external skill |
| project-stack-orchestrator | native replacement: `TASK-120`, `TASK-121`, `TASK-128` |
| project-support-router | native replacement: `TASK-120` |
| prioritize-scope | native replacement: task priority reorder plus `TASK-120` |
| execution-handoff | native replacement: checkpoints, closeouts, exports, plus `TASK-125` and `TASK-129` |
| connect-modules | native replacement: project graph, decomposition, and `TASK-124` |
| organize-modules | native replacement: project-material workflow plus `TASK-126` |
| refine-module | native replacement: decomposition/runtime composer; extend through `TASK-120` and `TASK-123` |
| review-project-loop | native replacement: project-material evaluation plus `TASK-124` |
| extract-skill-from-workflow | native replacement: capability promotion registry in `TASK-123` |
| analyze-project-experiment | external review use remains valid; covered by new `thinkio-independent-audit` skill |
| artifact-packager | external export use remains valid; covered by new `thinkio-export-assistant` skill |
| brainstorm-project | external proposal use remains valid; covered by new `thinkio-capability-proposal` skill |
| block-classifier | external review/classification use remains valid; covered by native project-material classification and new audit/proposal skills |
| ui-detail-planner | external UI review use remains valid; covered by new `thinkio-ui-review` skill and native `TASK-128` |
| ui-flow-planner | external UI review use remains valid; covered by new `thinkio-ui-review` skill and native `TASK-128` |

## Overlap Findings

The old skill library mixed authority, workflow routing, project memory, UI planning, and external review. In the current architecture, most of that belongs in native ThinkIO.

The remaining useful external skills are thin adapters: they help an external model use ThinkIO, review ThinkIO, recover archive intent, prepare exports, shape proposals, or evaluate UI. They must not mutate canonical state directly.

## Merge Candidates

No active skill merge was applied. Existing active skills are useful and distinct enough to keep separate.

## Keep-Separate Reasons

- `skill-opportunity-auditor` and `skill-trigger-auditor` remain distinct because one detects repeated work becoming a capability, while the other detects trigger/instruction patterns.
- `naming-convention-enforcer` remains useful externally even after `TASK-127` creates native semantic naming checks.
- `attitude-tech-writer` remains broad and should not become ThinkIO-specific.

## Retirement Candidates

The archived versions of project orchestration, support routing, scope prioritization, execution handoff, module organization, and project review should remain retired as skills once native tasks are implemented.

## Missing Skills Worth Considering Later

Provider-specific integration skills may be useful later, but only after native provider registry, secret, cost, and model-contract boundaries are ready.

## Applied Skill Set

Created six external-facing ThinkIO skills under `C:\Users\benja\.codex\skills`:

- `thinkio-workspace-operator`
- `thinkio-legacy-recovery`
- `thinkio-independent-audit`
- `thinkio-export-assistant`
- `thinkio-capability-proposal`
- `thinkio-ui-review`

All six validated with the skill creator validator after installing `pyyaml`.

## Handoff/Package Actions

The new skill set is installed locally in the active Codex skills folder. These skills should be considered external adapters, not ThinkIO-native runtime authority.

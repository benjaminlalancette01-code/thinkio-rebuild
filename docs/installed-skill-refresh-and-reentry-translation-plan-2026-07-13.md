# Installed Skill Refresh And Reentry Translation Plan - 2026-07-13

## Current Library Snapshot

Installed local skills were refreshed for the current ThinkIO plugin-first state:

- `attitude-tech-writer`
- `chat-length-guard`
- `naming-convention-enforcer`
- `project-master-updater`
- `skill-library-reviewer`
- `skill-opportunity-auditor`
- `skill-trigger-auditor`
- `thinkio-capability-proposal`
- `thinkio-export-assistant`
- `thinkio-independent-audit`
- `thinkio-legacy-recovery`
- `thinkio-ui-review`
- `thinkio-workspace-operator`
- `variant-decision-helper`

The system/bundled skills under `.system` were not edited.

## Overlap Findings

The ThinkIO-specific skills remain useful as external adapters, but their boundaries needed tightening so they do not revive deprecated chat-era behavior. The strongest overlap is intentional:

- `thinkio-workspace-operator` orients and checks safe action.
- `thinkio-legacy-recovery` translates archive evidence.
- `thinkio-capability-proposal` converts valid findings into candidate work.
- `thinkio-independent-audit` verifies claims without mutation.
- `thinkio-export-assistant` packages bounded evidence or model-review material.
- `thinkio-ui-review` evaluates plugin presentation against runtime truth.

The older general skills remain useful, but now explicitly route ThinkIO authority back to native files.

## Merge Candidates

No merge was applied. The skills are adjacent, but not redundant enough to merge safely.

## Keep-Separate Reasons

- Recovery, audit, proposal, export, UI review, and workspace operation are different actions with different authority risks.
- `skill-opportunity-auditor` and `skill-trigger-auditor` remain separate because opportunity detection and trigger formalization happen at different maturity points.
- `variant-decision-helper` remains non-ThinkIO-specific and should only support reusable visual block decisions, not plugin governance.

## Retirement Candidates

No installed skill was deleted. The deprecated behavior retired during this refresh is the old assumption that `reentry`, `handoff package`, or `project master` language should become active ThinkIO authority.

## Missing Skills Worth Considering Later

No new external skill is needed yet. Reentry translation should be native ThinkIO work first. If future model-provider integrations repeat, provider-specific external skills can be considered after the native provider registry, secret, cost, BAML, and ingestion boundaries mature.

## Reentry Translation Plan

Reentry was a cross-chat continuity mechanism. It mixed file selection, load-order rules, package manifests, session carry-forward, prompt behavior, model instruction, validation, and human review. In current ThinkIO it should be translated by responsibility:

| Historical reentry responsibility | Current ThinkIO destination |
| --- | --- |
| required load list | project identity, project-material index, context packet, session-grounding record |
| active reentry prompt | VS Code command/workflow plus runtime next-action resolver |
| cross-chat carry-forward | checkpoint, closeout, worktree reconciliation, project-state report |
| package manifest/checksum | export readiness profile, storage reliability check, version profile |
| model continuation instruction | BAML input/output contract, provider boundary, proposal ingest |
| accepted project mutation | CUE validation, runtime transaction, task evidence, approval boundary |
| archive recovery | historical translation registry, supersession record, human-reviewed candidate task |
| visible user workflow | plugin control surface, source selection, validation receipt, next-action display |

TASK-131 now captures the missing architecture pass that ties these pieces together before implementation proceeds too far.

## Recommended Next Actions

1. Resolve `TASK-131` before implementing the reentry-adjacent parts of `TASK-120`, `TASK-126`, and `TASK-129`.
2. Keep external skills advisory only; do not let them define canonical state.
3. When old reports mention reentry, translate the responsibility into kernel/runtime/CUE/BAML/plugin surfaces before creating implementation work.
4. Use BAML only for model-facing structured exchange, not for all local file management.

## Handoff/Package Actions

Updated local skills under `C:\Users\benja\.codex\skills`. These changes are installed locally for Codex. For ChatGPT use outside this local environment, the refreshed skill folders may still need to be exported or uploaded through the relevant skill mechanism.

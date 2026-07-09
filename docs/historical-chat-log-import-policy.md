# Historical Chat Log Import Policy

## Decision

Historical chat logs, prompt/reply logs, and transcripts should remain outside the VS Code plugin MVP.

They may be reviewed later as evidence-only imports. They must not become authority by default.

## Allowed Import Disposition

If this work is promoted later, a historical log may become:

- evidence-only reference material; or
- a structured interaction-log evidence record.

It may not become canonical event history by import alone.

## Required Import Fields

Any future historical chat import must preserve:

- source path;
- checksum;
- authority level;
- redaction decision;
- current-state compatibility decision.

## Forbidden Effects

Historical chat import cannot directly:

- create tasks;
- write files;
- change checkpoints;
- change runtime state;
- promote archive material into authority;
- bypass review.

## Plugin MVP Boundary

The plugin MVP should use live interaction logs attached to runtime records. Historical import is post-MVP review work unless the user explicitly promotes it.

## Task Evidence

This policy resolves TASK-063 evidence:

- `historical-chat-log-import-policy-reviewed`
- `legacy-transcript-authority-boundary-defined`
- `historical-log-import-decision-recorded`

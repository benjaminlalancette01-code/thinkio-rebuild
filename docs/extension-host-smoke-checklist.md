# Extension Host Smoke Checklist

## Launch

Automated smoke check:

```text
npm run smoke:extension-host
```

Manual smoke check:

1. Open `thinkio-rebuild` in VS Code.
2. Run `npm run check`.
3. Open Run and Debug.
4. Start `ThinkIO: Extension Host`.
5. Confirm the Extension Development Host opens `test-workspace`.
6. Confirm the ThinkIO activity icon appears.

## Activation

Confirm activation happens because `test-workspace/thinkio.config.json` exists.

If activation fails, check:

- Extension Host console;
- Developer Tools console;
- output from the pre-launch `ThinkIO: update views` task.

## Views

Open each ThinkIO view:

- Task Kanban;
- Artifact Mind Map;
- Runtime Node Diagram;
- Context;
- Proposal Review;
- Runtime Composer.

Expected result:

- every view renders;
- no view asks for an external Kanban, mind-map, graph, flowchart, or node-diagram plugin;
- fixture projection data appears where relevant;
- missing runtime data is shown as empty or blocked state, not a crash.

## Commands

Run these commands from the Command Palette:

- `ThinkIO: Refresh View`;
- `ThinkIO: Select Record`;
- `ThinkIO: Add Task Proposal`;
- `ThinkIO: Save Task Proposal`;
- `ThinkIO: Submit Runtime Composer`.

Expected result:

- proposal commands create proposal-shaped results;
- canonical mutation commands require approval;
- blocker messages are visible and understandable.

## Failure Capture

For any failure, record:

- command or view used;
- visible result;
- Extension Host console message;
- Developer Tools console message;
- whether projections were present in `test-workspace/views/`.

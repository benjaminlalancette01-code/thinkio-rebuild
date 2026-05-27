# ThinkIO Rebuild

This workspace is the clean rebuild of ThinkIO as a governed task/runtime layer.

ThinkIO is centered on governed task objects: tasks with authority, scoped context, dependencies, required evidence, transition rules, checkpoint behavior, and runtime gates.

The old ThinkIO package is historical source material only. Do not promote old files directly into this workspace.

## MVP Scope

TASK-001 proves the first end-to-end path:

```text
task JSON -> CUE schema -> state transition validation -> ledger entry -> context packet -> checkpoint record -> tests
```

No full VS Code extension, autonomous runtime, external API integration, or archive activation is implemented yet.

## Commands

```sh
npm run test
```

The test suite uses Node's built-in test runner.


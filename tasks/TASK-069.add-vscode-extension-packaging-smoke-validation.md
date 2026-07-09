# TASK-069: Add VS Code Extension Packaging And Smoke Validation

Add packaging and smoke validation so ThinkIO can be installed and exercised as a VS Code plugin.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

High. Without packaging and smoke validation, ThinkIO can have correct architecture but still fail as a plugin.

## Subtasks

- Add VSIX/package build script.
- Add local install/run instructions.
- Add extension activation smoke test.
- Add core view smoke test.
- Validate packaged assets are included.
- Ensure smoke tests confirm direct mutation remains blocked.

## Detailed Plan For Review

### What Will Be Added

- package/build scripts in `package.json`.
- packaging helper under `scripts/`.
- VS Code extension smoke test fixtures under `tests/extension-smoke/` or `test-workspace/`.
- packaging documentation in `docs/vscode-plugin-runbook.md`.
- packaged asset validation test.

### Packaging Requirements

The package script should verify:

- extension manifest exists.
- compiled extension entrypoint exists.
- media assets are included.
- no external view plugin dependency is required.
- runtime/schema files needed by the plugin are included.
- package can be built locally.

### Smoke Test Requirements

Smoke tests should verify:

- extension activates in a test workspace.
- ThinkIO commands are registered.
- core view providers load.
- generated projections can be read.
- direct mutation commands are blocked unless routed through governance.
- missing workspace state fails with an understandable message.

### How It Will Be Added

1. Add package/build scripts.
2. Add smoke test workspace fixture.
3. Add test runner script for extension smoke validation.
4. Add packaged asset validator.
5. Add runbook with local install/run/test steps.

### Review Checklist

- Should packaging use `@vscode/vsce` or a local validation-first script before VSIX?
- Should smoke tests run in CI by default or only on demand?
- What is the minimum acceptable local install path for the first plugin test?
- Should the package include generated views or rebuild them on activation?

### Out Of Scope

- Marketplace publishing.
- Signed release artifacts.
- Remote model provider integration.
- Cross-platform installer polish.

## ThinkIO Alignment

- Proves ThinkIO can leave architecture mode and run as a plugin.
- Keeps installable plugin behavior governed.
- Confirms bundled assets and native views are present.

## Required Evidence

- `vsix-packaging-script-added`
- `extension-activation-smoke-test-added`
- `core-view-smoke-test-added`
- `packaged-asset-validation-added`

## Completion Evidence

- `scripts/validate-vscode-extension-package.mjs` validates extension entrypoint, command contributions, view contributions, bundled assets, and forbidden view-extension dependencies.
- `package.json` adds `validate:extension` and `package:extension` scripts.
- `docs/vscode-plugin-runbook.md` documents local validation and packaging strategy.
- `tests/vscode-extension-shell.test.ts` provides extension shell smoke checks.

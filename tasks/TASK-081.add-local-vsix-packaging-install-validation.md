# TASK-081: Add Local VSIX Packaging And Install Validation

Add a real local VSIX/package workflow after the validation-first package shell.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

Medium-high. ThinkIO validates as an extension shell, but installable plugin use needs a package artifact path.

## Subtasks

- Decide whether to use `@vscode/vsce` or a no-network local package script first.
- Add packaged file allowlist.
- Validate extension package contents before install.
- Document local install/uninstall steps.
- Add tests or script validation for package metadata and file inclusion.

## ThinkIO Alignment

- Keeps packaging local before marketplace publishing.
- Does not promote marketplace publishing or signed release polish.
- Preserves self-contained plugin asset requirements.

## Required Evidence

- `local-vsix-build-path-added`
- `local-install-validation-added`
- `packaged-file-allowlist-added`
- `vsix-validation-tests-pass`

## Completion Evidence

- `scripts/vsix-file-allowlist.json` defines the local package allowlist.
- `scripts/validate-local-vsix-package.mjs` validates the local VSIX allowlist and packaging boundary.
- `scripts/package-local-vsix.mjs` creates a no-network local `.vsix` artifact under `local-vsix/`.
- `package.json` adds `validate:vsix` and updates `package:extension` to validate and build the local VSIX.
- `docs/vscode-plugin-runbook.md` documents package, install, uninstall, and future marketplace boundaries.
- `tests/vscode-extension-shell.test.ts` and `tests/cue-validator.test.ts` cover local VSIX scripts, allowlist, and install docs.
- `npm run package:extension` created `local-vsix/thinkio-rebuild-0.2.1.vsix`.

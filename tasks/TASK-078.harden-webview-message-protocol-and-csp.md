# TASK-078: Harden Webview Message Protocol And CSP

Harden the message boundary between ThinkIO webviews and the extension host.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

High. Webview messages are the first real UI command path. They must be allowlisted, structured, and routed through governance.

## Subtasks

- Add a shared webview message schema/validator.
- Allow only known `plugin.*` command IDs from webviews.
- Return structured acknowledgement/error messages to webviews.
- Replace placeholder asset URI handling with VS Code-safe `asWebviewUri` usage.
- Strengthen CSP generation and nonce handling.
- Add tests for blocked commands, malformed messages, and local-only asset loading.

## ThinkIO Alignment

- Keeps webviews as governed projections.
- Blocks direct UI mutation paths.
- Keeps local bundled assets self-contained.

## Required Evidence

- `webview-message-schema-added`
- `webview-command-allowlist-enforced`
- `webview-csp-asset-uris-hardened`
- `webview-message-tests-pass`

## Completion Evidence

- `extension/views/webview-messages.js` adds shared webview message validation, command allowlisting, structured acknowledgements, and message handling.
- Core and composer/proposal webview providers route messages through `handleWebviewMessage`.
- Webview providers use `localResourceRoots` and `webview.asWebviewUri` for local bundled media assets.
- `extension/views/webview-html.js` generates nonce-based script CSP and removes placeholder media paths.
- Media scripts send request IDs and receive acknowledgement status messages.
- `tests/vscode-extension-shell.test.ts` covers malformed messages, unknown commands, structured acknowledgements, and asset URI hardening.

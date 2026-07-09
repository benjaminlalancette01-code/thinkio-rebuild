import { randomBytes } from "node:crypto";

export function renderThinkIOWebviewHtml(options) {
  const nonce = options.nonce ?? createNonce();
  const scriptUri = options.scriptUri ?? "";
  const styleUri = options.styleUri ?? "";
  const payload = escapeHtml(JSON.stringify(options.payload ?? {}));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${options.cspSource}; style-src ${options.cspSource}; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${styleUri ? `<link rel="stylesheet" href="${styleUri}">` : ""}
  <title>${escapeHtml(options.title)}</title>
</head>
<body>
  <main id="thinkio-root" data-view="${escapeHtml(options.viewKind)}">
    <h1>${escapeHtml(options.title)}</h1>
    <section id="thinkio-governance" class="thinkio-governance" data-state="idle" aria-live="polite">
      <h2>Governance</h2>
      <p class="thinkio-governance-summary">No command result yet.</p>
      <ul class="thinkio-governance-blockers"></ul>
    </section>
    <pre id="thinkio-data">${payload}</pre>
  </main>
  ${scriptUri ? `<script nonce="${nonce}" src="${scriptUri}"></script>` : ""}
</body>
</html>`;
}

export function createNonce() {
  return randomBytes(16).toString("base64");
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

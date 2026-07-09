const vscode = typeof acquireVsCodeApi === "function" ? acquireVsCodeApi() : undefined;
document.body.dataset.thinkioViewReady = "runtime-composer";
window.addEventListener("submit", (event) => {
  event.preventDefault();
  vscode?.postMessage?.({ requestId: `runtime-composer-${Date.now()}`, command: "plugin.submit-runtime-composer", payload: { source: "runtime-composer" } });
});
window.addEventListener("message", (event) => {
  document.body.dataset.thinkioLastMessageStatus = event.data?.status ?? "unknown";
  renderGovernance(event.data?.governance);
  if (event.data?.type === "thinkio.projectionRefresh") {
    document.body.dataset.thinkioLastRefreshStatus = event.data.ok ? "ok" : "stale";
    const data = document.getElementById("thinkio-data");
    if (data) data.textContent = JSON.stringify(event.data.projection ?? { blockers: event.data.blockers }, null, 2);
    if (!event.data.ok) renderGovernance({ state: "blocked", title: "Projection Stale", blockers: event.data.blockers ?? [] });
  }
});

function renderGovernance(governance) {
  if (!governance) return;
  const root = document.getElementById("thinkio-governance");
  const summary = root?.querySelector(".thinkio-governance-summary");
  const blockers = root?.querySelector(".thinkio-governance-blockers");
  if (!root || !summary || !blockers) return;
  root.dataset.state = governance.state ?? "unknown";
  summary.textContent = `${governance.title ?? "Result"}${governance.commandId ? `: ${governance.commandId}` : ""}`;
  blockers.replaceChildren(...(governance.blockers ?? []).map((blocker) => {
    const item = document.createElement("li");
    item.textContent = blocker;
    return item;
  }));
}

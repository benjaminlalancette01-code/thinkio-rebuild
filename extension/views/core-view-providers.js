import { viewIds } from "../contracts.js";
import { renderThinkIOWebviewHtml } from "./webview-html.js";
import { handleWebviewMessage } from "./webview-messages.js";

const coreViews = [
  { id: viewIds.taskKanban, kind: "task-kanban", title: "Task Kanban", script: "task-kanban.js" },
  { id: viewIds.artifactMindmap, kind: "artifact-mindmap", title: "Artifact Mind Map", script: "artifact-mindmap.js" },
  { id: viewIds.runtimeNodeDiagram, kind: "runtime-node-diagram", title: "Runtime Node Diagram", script: "runtime-node-diagram.js" }
];

export function registerCoreViewProviders(context, vscode, runtimeBridge) {
  const providers = coreViews.map((view) => new ThinkIOProjectionViewProvider(context, vscode, runtimeBridge, view));
  const disposables = providers.map((provider) =>
    vscode.window.registerWebviewViewProvider(provider.view.id, provider)
  );

  context.subscriptions.push(...disposables);
  return providers;
}

export class ThinkIOProjectionViewProvider {
  constructor(context, vscode, runtimeBridge, view) {
    this.context = context;
    this.vscode = vscode;
    this.runtimeBridge = runtimeBridge;
    this.view = view;
    this.webviewView = undefined;
  }

  async resolveWebviewView(webviewView) {
    this.webviewView = webviewView;
    const webview = webviewView.webview;
    webview.options = {
      enableScripts: true,
      localResourceRoots: [this.mediaRoot()]
    };
    const projection = await this.runtimeBridge.readProjection(this.view.kind);

    webview.html = this.render(webview, projection);
    webview.onDidReceiveMessage?.(async (message) => {
      await handleWebviewMessage({ message, runtimeBridge: this.runtimeBridge, webview });
    });
  }

  async refresh(source = "manual") {
    if (!this.webviewView?.webview) return;
    const projection = await this.runtimeBridge.readProjection(this.view.kind);
    await this.webviewView.webview.postMessage?.({
      type: "thinkio.projectionRefresh",
      viewKind: this.view.kind,
      source,
      ok: Boolean(projection.ok),
      projection: projection.data,
      blockers: projection.blockers ?? [],
      refreshedAt: new Date().toISOString()
    });
  }

  render(webview, projection) {
    return renderThinkIOWebviewHtml({
      title: this.view.title,
      viewKind: this.view.kind,
      payload: projection,
      cspSource: webview.cspSource,
      scriptUri: this.assetUri(webview, this.view.script),
      styleUri: this.assetUri(webview, "thinkio.css")
    });
  }

  assetUri(webview, fileName) {
    return webview.asWebviewUri(this.vscode.Uri.joinPath(this.mediaRoot(), fileName)).toString();
  }

  mediaRoot() {
    return this.vscode.Uri.joinPath(this.context.extensionUri, "media");
  }
}

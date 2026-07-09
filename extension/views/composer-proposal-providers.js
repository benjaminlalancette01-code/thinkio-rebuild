import { viewIds } from "../contracts.js";
import { renderThinkIOWebviewHtml } from "./webview-html.js";
import { handleWebviewMessage } from "./webview-messages.js";

const panelViews = [
  { id: viewIds.contextPanel, kind: "context-panel", title: "Context", script: "runtime-composer.js" },
  { id: viewIds.proposalReview, kind: "proposal-review", title: "Proposal Review", script: "proposal-review.js" },
  { id: viewIds.runtimeComposer, kind: "runtime-composer", title: "Runtime Composer", script: "runtime-composer.js" }
];

export function registerComposerAndProposalProviders(context, vscode, runtimeBridge, stores) {
  const providers = panelViews.map((view) => new ThinkIOPanelProvider(context, vscode, runtimeBridge, stores, view));
  const disposables = providers.map((provider) =>
    vscode.window.registerWebviewViewProvider(provider.view.id, provider)
  );

  context.subscriptions.push(...disposables);
  return providers;
}

export class ThinkIOPanelProvider {
  constructor(context, vscode, runtimeBridge, stores, view) {
    this.context = context;
    this.vscode = vscode;
    this.runtimeBridge = runtimeBridge;
    this.stores = stores;
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
    webview.html = this.render(webview);
    webview.onDidReceiveMessage?.(async (message) => {
      await handleWebviewMessage({
        message,
        runtimeBridge: this.runtimeBridge,
        webview,
        beforeExecute: async (parsed) => {
          if (parsed.command === "plugin.record-interaction") {
            await this.stores.interactionLog.append(parsed.payload ?? {});
          }
          if (parsed.command === "plugin.add-task-proposal") {
            await this.stores.taskProposal.append(parsed.payload ?? {});
          }
        }
      });
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

  render(webview) {
    return renderThinkIOWebviewHtml({
      title: this.view.title,
      viewKind: this.view.kind,
      payload: {
        resultState: this.view.kind === "runtime-composer" ? "empty" : "proposal",
        usesGenericTranscript: false
      },
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

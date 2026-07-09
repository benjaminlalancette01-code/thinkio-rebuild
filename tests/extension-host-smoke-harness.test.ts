import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { activateThinkIO } from "../extension/extension.js";

test("automated Extension Host smoke harness activates commands, views, watchers, and mutation blockers", async () => {
  const registeredCommands = new Map<string, (payload?: Record<string, unknown>) => Promise<Record<string, unknown>>>();
  const registeredViews = new Map<string, unknown>();
  const shownWarnings: string[] = [];
  const watchers: unknown[] = [];
  const workspaceState = createWorkspaceState();
  const context = {
    extensionUri: createUri(process.cwd()),
    workspaceState,
    subscriptions: [] as unknown[]
  };
  const vscode = {
    workspace: {
      workspaceFolders: [{ uri: createUri(resolve("test-workspace")) }],
      createFileSystemWatcher(pattern: unknown) {
        const watcher = {
          pattern,
          onDidChange() {
            return undefined;
          },
          onDidCreate() {
            return undefined;
          },
          onDidDelete() {
            return undefined;
          },
          dispose() {
            return undefined;
          }
        };
        watchers.push(watcher);
        return watcher;
      }
    },
    RelativePattern: class {
      root: unknown;
      pattern: string;
      constructor(root: unknown, pattern: string) {
        this.root = root;
        this.pattern = pattern;
      }
    },
    Uri: {
      joinPath(base: { fsPath: string }, ...parts: string[]) {
        return createUri(resolve(base.fsPath, ...parts));
      }
    },
    commands: {
      registerCommand(id: string, callback: (payload?: Record<string, unknown>) => Promise<Record<string, unknown>>) {
        registeredCommands.set(id, callback);
        return {
          dispose() {
            return undefined;
          }
        };
      }
    },
    window: {
      registerWebviewViewProvider(id: string, provider: unknown) {
        registeredViews.set(id, provider);
        return {
          dispose() {
            return undefined;
          }
        };
      },
      showInformationMessage() {
        return undefined;
      },
      showWarningMessage(message: string) {
        shownWarnings.push(message);
      },
      showErrorMessage(message: string) {
        shownWarnings.push(message);
      }
    }
  };

  const activated = activateThinkIO(context, vscode);

  assert.equal(activated.commands.length, 15);
  assert.equal(activated.coreViews.length, 3);
  assert.equal(activated.panels.length, 3);
  assert.equal(activated.watchers.length, 3);
  assert.equal(registeredViews.has("thinkio.taskKanban"), true);
  assert.equal(registeredCommands.has("thinkio.applyApprovedProposal"), true);

  const blockedMutation = await registeredCommands.get("thinkio.applyApprovedProposal")?.({});
  assert.equal(blockedMutation?.status, "approval-required");
  assert.ok(shownWarnings.some((message) => message.includes("requires approval")));

  const taskKanbanProvider = registeredViews.get("thinkio.taskKanban") as {
    resolveWebviewView(view: { webview: ReturnType<typeof createWebview> }): Promise<void>;
  };
  const webview = createWebview();
  await taskKanbanProvider.resolveWebviewView({ webview });

  assert.equal(webview.options.enableScripts, true);
  assert.ok(webview.html.includes("thinkio-governance"));
  assert.ok(webview.html.includes("TASK-SMOKE-001"));
});

function createWorkspaceState() {
  const state = new Map<string, unknown>();
  return {
    get(key: string, fallback: unknown) {
      return state.has(key) ? state.get(key) : fallback;
    },
    async update(key: string, value: unknown) {
      if (value === undefined) state.delete(key);
      else state.set(key, value);
    }
  };
}

function createWebview() {
  return {
    options: {} as Record<string, unknown>,
    html: "",
    cspSource: "vscode-resource:",
    asWebviewUri(uri: { toString(): string }) {
      return uri;
    },
    onDidReceiveMessage() {
      return undefined;
    },
    async postMessage() {
      return true;
    }
  };
}

function createUri(fsPath: string) {
  return {
    fsPath,
    toString() {
      return `vscode-resource:${fsPath.replaceAll("\\", "/")}`;
    }
  };
}

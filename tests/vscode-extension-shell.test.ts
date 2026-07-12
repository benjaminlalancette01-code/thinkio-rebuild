import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { createWebviewAcknowledgement, validateWebviewMessage } from "../extension/views/webview-messages.js";
import { watchedProjectionPatterns } from "../extension/projection-watchers.js";
import { buildGovernanceResultViewModel } from "../extension/views/governance-ui.js";
import { createRuntimeBridge } from "../extension/runtime-bridge.js";

const commandIds = [
  "thinkio.refreshView",
  "thinkio.selectRecord",
  "thinkio.openRecord",
  "thinkio.switchMode",
  "thinkio.addTaskProposal",
  "thinkio.saveTaskProposal",
  "thinkio.createWorkPackage",
  "thinkio.ingestProviderOutput",
  "thinkio.requestApproval",
  "thinkio.deferWork",
  "thinkio.rejectProposal",
  "thinkio.applyApprovedProposal",
  "thinkio.openProposalReview",
  "thinkio.recordInteraction",
  "thinkio.submitRuntimeComposer",
  "thinkio.evaluateProjectMaterials",
  "thinkio.searchProjectMaterials"
];

const viewIds = [
  "thinkio.taskKanban",
  "thinkio.artifactMindmap",
  "thinkio.runtimeNodeDiagram",
  "thinkio.contextPanel",
  "thinkio.proposalReview",
  "thinkio.runtimeComposer",
  "thinkio.projectNavigation"
];

const requiredExtensionFiles = [
  "extension/extension.js",
  "extension/contracts.js",
  "extension/commands.js",
  "extension/runtime-bridge.js",
  "extension/projection-watchers.js",
  "extension/views/core-view-providers.js",
  "extension/views/composer-proposal-providers.js",
  "extension/views/webview-messages.js",
  "extension/views/governance-ui.js",
  "extension/state/workspace-state.js",
  "extension/interaction/stores.js",
  ".vscode/launch.json",
  "test-workspace/thinkio.config.json",
  "test-workspace/views/kanban.json",
  "test-workspace/views/mindmap.json",
  "test-workspace/views/thinkio-runtime-flow.json",
  "test-workspace/views/dashboard.json",
  "docs/extension-host-smoke-checklist.md",
  "media/thinkio.svg",
  "media/thinkio.css",
  "media/task-kanban.js",
  "media/artifact-mindmap.js",
  "media/runtime-node-diagram.js",
  "media/runtime-composer.js",
  "media/proposal-review.js",
  "media/project-navigation.js"
];

test("VS Code extension manifest declares ThinkIO commands and views", async () => {
  const pkg = JSON.parse(await readFile("package.json", "utf8")) as {
    main: string;
    activationEvents: string[];
    contributes: {
      commands: Array<{ command: string }>;
      views: { thinkio: Array<{ id: string }> };
      viewsContainers: { activitybar: Array<{ id: string }> };
    };
  };

  assert.equal(pkg.main, "./extension/extension.js");
  assert.ok(pkg.activationEvents.includes("workspaceContains:thinkio.config.json"));
  assert.equal(pkg.contributes.viewsContainers.activitybar.some((container) => container.id === "thinkio"), true);

  for (const command of commandIds) {
    assert.equal(pkg.contributes.commands.some((entry) => entry.command === command), true, command);
  }

  for (const view of viewIds) {
    assert.equal(pkg.contributes.views.thinkio.some((entry) => entry.id === view), true, view);
  }
});

test("VS Code extension package files and bundled assets exist", async () => {
  for (const file of requiredExtensionFiles) {
    await access(file);
  }
});

test("VS Code extension shell keeps command routing and views local", async () => {
  const contracts = await readFile("extension/contracts.js", "utf8");
  const commands = await readFile("extension/commands.js", "utf8");
  const bridge = await readFile("extension/runtime-bridge.js", "utf8");
  const extension = await readFile("extension/extension.js", "utf8");
  const coreViews = await readFile("extension/views/core-view-providers.js", "utf8");
  const panels = await readFile("extension/views/composer-proposal-providers.js", "utf8");

  assert.match(contracts, /plugin\.save-task-proposal/);
  assert.match(commands, /registerCommand/);
  assert.match(bridge, /requires approval before canonical mutation/);
  assert.match(bridge, /update-project-materials/);
  assert.match(bridge, /search-project-materials/);
  assert.match(extension, /registerProjectionRefreshWatchers/);
  assert.match(coreViews, /registerWebviewViewProvider/);
  assert.match(coreViews, /localResourceRoots/);
  assert.match(coreViews, /asWebviewUri/);
  assert.match(panels, /plugin\.record-interaction/);
  assert.match(panels, /handleWebviewMessage/);
  assert.match(panels, /project-navigation/);
});

test("projection refresh watchers cover views, tasks, and state files", () => {
  assert.deepEqual(watchedProjectionPatterns(), ["views/*.json", "tasks/*.json", "state/*.json"]);
});

test("webview providers expose projection refresh events with stale blockers", async () => {
  const coreViews = await readFile("extension/views/core-view-providers.js", "utf8");
  const panels = await readFile("extension/views/composer-proposal-providers.js", "utf8");
  const taskKanban = await readFile("media/task-kanban.js", "utf8");

  assert.match(coreViews, /type: "thinkio\.projectionRefresh"/);
  assert.match(coreViews, /blockers: projection\.blockers/);
  assert.match(panels, /type: "thinkio\.projectionRefresh"/);
  assert.match(taskKanban, /thinkioLastRefreshStatus/);
});

test("extension validation script is wired into package scripts", async () => {
  const pkg = JSON.parse(await readFile("package.json", "utf8")) as {
    scripts: Record<string, string>;
  };

  assert.equal(pkg.scripts["validate:extension"], "node scripts/validate-vscode-extension-package.mjs");
  assert.equal(pkg.scripts["validate:vsix"], "node scripts/validate-local-vsix-package.mjs");
  assert.equal(pkg.scripts["package:extension"], "npm run validate:extension && npm run validate:vsix && node scripts/package-local-vsix.mjs");
  assert.match(pkg.scripts.check, /validate:extension/);
});

test("local VSIX packaging has an allowlist and install runbook", async () => {
  const allowlist = JSON.parse(await readFile("scripts/vsix-file-allowlist.json", "utf8")) as {
    files: string[];
  };
  const runbook = await readFile("docs/vscode-plugin-runbook.md", "utf8");

  assert.ok(allowlist.files.includes("package.json"));
  assert.ok(allowlist.files.includes("extension/extension.js"));
  assert.ok(allowlist.files.includes("media/task-kanban.js"));
  assert.match(runbook, /npm run package:extension/);
  assert.match(runbook, /code --install-extension local-vsix/);
  assert.match(runbook, /code --uninstall-extension thinkio\.thinkio-rebuild/);
});

test("Extension Host launch workflow opens the ThinkIO test workspace", async () => {
  const launch = JSON.parse(await readFile(".vscode/launch.json", "utf8")) as {
    configurations: Array<{
      name: string;
      type: string;
      args: string[];
      preLaunchTask?: string;
    }>;
  };
  const config = launch.configurations.find((entry) => entry.name === "ThinkIO: Extension Host");
  const testWorkspaceConfig = JSON.parse(await readFile("test-workspace/thinkio.config.json", "utf8")) as {
    project: string;
    allowArchiveReadsByDefault: boolean;
  };
  const checklist = await readFile("docs/extension-host-smoke-checklist.md", "utf8");

  assert.ok(config);
  assert.equal(config?.type, "extensionHost");
  assert.ok(config?.args.includes("--extensionDevelopmentPath=${workspaceFolder}"));
  assert.ok(config?.args.includes("${workspaceFolder}/test-workspace"));
  assert.equal(config?.preLaunchTask, "ThinkIO: update views");
  assert.equal(testWorkspaceConfig.project, "thinkio-extension-host-test");
  assert.equal(testWorkspaceConfig.allowArchiveReadsByDefault, false);
  assert.match(checklist, /Task Kanban/);
  assert.match(checklist, /Runtime Composer/);
});

test("webview message protocol blocks malformed and unknown commands", () => {
  assert.deepEqual(validateWebviewMessage(null).blockers, ["Webview message must be an object."]);

  const unknown = validateWebviewMessage({ command: "evil.write-file", payload: {} });
  assert.equal(unknown.ok, false);
  assert.ok(unknown.blockers.some((blocker) => blocker.includes("not allowed")));

  const malformed = validateWebviewMessage({ command: "plugin.select-record", payload: [] });
  assert.equal(malformed.ok, false);
  assert.ok(malformed.blockers.some((blocker) => blocker.includes("payload must be an object")));

  const allowed = validateWebviewMessage({
    requestId: "REQ-1",
    command: "plugin.select-record",
    payload: { source: "test" }
  });
  assert.equal(allowed.ok, true);
  assert.equal(allowed.command, "plugin.select-record");
});

test("webview acknowledgements are structured for command results", () => {
  const acknowledgement = createWebviewAcknowledgement(
    { ok: true, requestId: "REQ-1", command: "plugin.select-record", payload: {}, blockers: [] },
    { ok: true, status: "ok", blockers: [] }
  );

  assert.equal(acknowledgement.type, "thinkio.commandResult");
  assert.equal(acknowledgement.requestId, "REQ-1");
  assert.equal(acknowledgement.command, "plugin.select-record");
  assert.equal(acknowledgement.ok, true);
  assert.deepEqual(acknowledgement.blockers, []);
  assert.equal(acknowledgement.governance.title, "Validated");
});

test("runtime bridge creates distinct proposal ids under repeated commands", async () => {
  const bridge = createRuntimeBridge(process.cwd());
  const first = await bridge.execute("plugin.add-task-proposal", { title: "First" });
  const second = await bridge.execute("plugin.submit-runtime-composer", { title: "Second" });
  const firstProposal = first.proposal as { id?: string } | undefined;
  const secondProposal = second.proposal as { id?: string } | undefined;

  assert.equal(first.status, "proposal-created");
  assert.equal(second.status, "proposal-created");
  assert.notEqual(firstProposal?.id, secondProposal?.id);
});

test("governance result model exposes blockers, proposals, and approval states", () => {
  assert.deepEqual(buildGovernanceResultViewModel({
    ok: false,
    status: "approval-required",
    commandId: "plugin.save-task-proposal",
    runtimeAction: "plan-mutation-transaction",
    blockers: ["Approval missing."]
  }), {
    state: "approval-required",
    title: "Approval Required",
    commandId: "plugin.save-task-proposal",
    runtimeAction: "plan-mutation-transaction",
    blockers: ["Approval missing."],
    proposalId: undefined,
    approvalRequired: true,
    reviewable: true
  });

  const proposal = buildGovernanceResultViewModel({
    ok: true,
    status: "proposal-created",
    commandId: "plugin.add-task-proposal",
    proposal: { id: "PROPOSAL-1" }
  });

  assert.equal(proposal.title, "Proposal Created");
  assert.equal(proposal.proposalId, "PROPOSAL-1");
  assert.equal(proposal.reviewable, true);
});

test("webview HTML uses nonce script CSP and no placeholder media paths in providers", async () => {
  const htmlRenderer = await readFile("extension/views/webview-html.js", "utf8");
  const coreViews = await readFile("extension/views/core-view-providers.js", "utf8");
  const panels = await readFile("extension/views/composer-proposal-providers.js", "utf8");

  assert.match(htmlRenderer, /script-src 'nonce-\$\{nonce\}'/);
  assert.doesNotMatch(coreViews, /\.\.\/media/);
  assert.doesNotMatch(panels, /\.\.\/media/);
  assert.match(coreViews, /webview\.asWebviewUri/);
  assert.match(panels, /webview\.asWebviewUri/);
});

test("webview HTML and media scripts render governance blockers inline", async () => {
  const htmlRenderer = await readFile("extension/views/webview-html.js", "utf8");
  const css = await readFile("media/thinkio.css", "utf8");
  const composer = await readFile("media/runtime-composer.js", "utf8");

  assert.match(htmlRenderer, /thinkio-governance/);
  assert.match(css, /thinkio-governance-blockers/);
  assert.match(composer, /function renderGovernance/);
  assert.match(composer, /Projection Stale/);
});

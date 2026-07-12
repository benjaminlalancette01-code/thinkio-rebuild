import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "extension/extension.js",
  "extension/contracts.js",
  "extension/commands.js",
  "extension/runtime-bridge.js",
  "extension/projection-watchers.js",
  "extension/views/core-view-providers.js",
  "extension/views/composer-proposal-providers.js",
  "extension/views/webview-html.js",
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

const requiredCommands = [
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

const requiredViews = [
  "thinkio.taskKanban",
  "thinkio.artifactMindmap",
  "thinkio.runtimeNodeDiagram",
  "thinkio.contextPanel",
  "thinkio.proposalReview",
  "thinkio.runtimeComposer",
  "thinkio.projectNavigation"
];

const blockers = [];
const pkg = JSON.parse(await readFile("package.json", "utf8"));

if (pkg.main !== "./extension/extension.js") {
  blockers.push("package.json main must point to ./extension/extension.js.");
}

for (const command of requiredCommands) {
  if (!pkg.contributes?.commands?.some((entry) => entry.command === command)) {
    blockers.push(`Missing command contribution ${command}.`);
  }
}

for (const view of requiredViews) {
  if (!pkg.contributes?.views?.thinkio?.some((entry) => entry.id === view)) {
    blockers.push(`Missing ThinkIO view contribution ${view}.`);
  }
}

for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    blockers.push(`Missing extension package file ${file}.`);
  }
}

const forbiddenExtensionDeps = pkg.extensionDependencies?.filter((dependency) =>
  /(kanban|mind.?map|node.?diagram|flowchart|graph)/i.test(dependency)
) ?? [];

for (const dependency of forbiddenExtensionDeps) {
  blockers.push(`Forbidden external view extension dependency ${dependency}.`);
}

if (blockers.length > 0) {
  console.error(blockers.join("\n"));
  process.exit(1);
}

console.log("VS Code extension package validation passed.");

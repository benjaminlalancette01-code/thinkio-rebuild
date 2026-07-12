export const internalCommandIds = [
  "plugin.refresh-view",
  "plugin.select-record",
  "plugin.open-record",
  "plugin.switch-mode",
  "plugin.add-task-proposal",
  "plugin.save-task-proposal",
  "plugin.create-work-package",
  "plugin.ingest-provider-output",
  "plugin.request-approval",
  "plugin.defer-work",
  "plugin.reject-proposal",
  "plugin.apply-approved-proposal",
  "plugin.open-proposal-review",
  "plugin.record-interaction",
  "plugin.submit-runtime-composer",
  "plugin.evaluate-project-materials",
  "plugin.search-project-materials"
];

export const commandIdMap = {
  "plugin.refresh-view": "thinkio.refreshView",
  "plugin.select-record": "thinkio.selectRecord",
  "plugin.open-record": "thinkio.openRecord",
  "plugin.switch-mode": "thinkio.switchMode",
  "plugin.add-task-proposal": "thinkio.addTaskProposal",
  "plugin.save-task-proposal": "thinkio.saveTaskProposal",
  "plugin.create-work-package": "thinkio.createWorkPackage",
  "plugin.ingest-provider-output": "thinkio.ingestProviderOutput",
  "plugin.request-approval": "thinkio.requestApproval",
  "plugin.defer-work": "thinkio.deferWork",
  "plugin.reject-proposal": "thinkio.rejectProposal",
  "plugin.apply-approved-proposal": "thinkio.applyApprovedProposal",
  "plugin.open-proposal-review": "thinkio.openProposalReview",
  "plugin.record-interaction": "thinkio.recordInteraction",
  "plugin.submit-runtime-composer": "thinkio.submitRuntimeComposer",
  "plugin.evaluate-project-materials": "thinkio.evaluateProjectMaterials",
  "plugin.search-project-materials": "thinkio.searchProjectMaterials"
};

export const viewIds = {
  taskKanban: "thinkio.taskKanban",
  artifactMindmap: "thinkio.artifactMindmap",
  runtimeNodeDiagram: "thinkio.runtimeNodeDiagram",
  contextPanel: "thinkio.contextPanel",
  proposalReview: "thinkio.proposalReview",
  runtimeComposer: "thinkio.runtimeComposer",
  projectNavigation: "thinkio.projectNavigation"
};

export const bundledAssets = [
  "media/thinkio.svg",
  "media/thinkio.css",
  "media/task-kanban.js",
  "media/artifact-mindmap.js",
  "media/runtime-node-diagram.js",
  "media/runtime-composer.js",
  "media/proposal-review.js",
  "media/project-navigation.js"
];

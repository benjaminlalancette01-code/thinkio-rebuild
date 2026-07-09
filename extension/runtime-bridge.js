import { readFile } from "node:fs/promises";

const routeByInternalCommand = {
  "plugin.refresh-view": { runtimeAction: "update-views", mutatesCanonicalState: false, requiresApproval: false, producesProposal: false },
  "plugin.select-record": { runtimeAction: "build-context-packet", mutatesCanonicalState: false, requiresApproval: false, producesProposal: false },
  "plugin.open-record": { runtimeAction: "build-context-packet", mutatesCanonicalState: false, requiresApproval: false, producesProposal: false },
  "plugin.switch-mode": { runtimeAction: "evaluate-governance-decision", mutatesCanonicalState: false, requiresApproval: false, producesProposal: true },
  "plugin.add-task-proposal": { runtimeAction: "evaluate-governance-decision", mutatesCanonicalState: false, requiresApproval: false, producesProposal: true },
  "plugin.save-task-proposal": { runtimeAction: "plan-mutation-transaction", mutatesCanonicalState: true, requiresApproval: true, producesProposal: false },
  "plugin.create-work-package": { runtimeAction: "validate-work-package", mutatesCanonicalState: false, requiresApproval: false, producesProposal: true },
  "plugin.ingest-provider-output": { runtimeAction: "validate-provider-output-ingest", mutatesCanonicalState: false, requiresApproval: false, producesProposal: true },
  "plugin.request-approval": { runtimeAction: "evaluate-governance-decision", mutatesCanonicalState: false, requiresApproval: false, producesProposal: false },
  "plugin.defer-work": { runtimeAction: "evaluate-governance-decision", mutatesCanonicalState: false, requiresApproval: false, producesProposal: true },
  "plugin.reject-proposal": { runtimeAction: "evaluate-governance-decision", mutatesCanonicalState: false, requiresApproval: false, producesProposal: false },
  "plugin.apply-approved-proposal": { runtimeAction: "apply-mutation-transaction", mutatesCanonicalState: true, requiresApproval: true, producesProposal: false },
  "plugin.open-proposal-review": { runtimeAction: "validate-interaction-surface", mutatesCanonicalState: false, requiresApproval: false, producesProposal: false },
  "plugin.record-interaction": { runtimeAction: "validate-interaction-surface", mutatesCanonicalState: false, requiresApproval: false, producesProposal: false },
  "plugin.submit-runtime-composer": { runtimeAction: "validate-interaction-surface", mutatesCanonicalState: false, requiresApproval: false, producesProposal: true }
};

const projectionFiles = {
  "task-kanban": "views/kanban.json",
  "artifact-mindmap": "views/mindmap.json",
  "runtime-node-diagram": "views/thinkio-runtime-flow.json",
  "context-panel": "views/dashboard.json",
  "proposal-review": "views/dashboard.json",
  "runtime-composer": "views/dashboard.json"
};

export function createRuntimeBridge(workspaceRoot = process.cwd()) {
  return {
    async execute(internalCommandId, payload = {}) {
      return executePluginCommand(internalCommandId, payload);
    },
    async readProjection(viewKind) {
      return readProjection(workspaceRoot, viewKind);
    }
  };
}

export async function executePluginCommand(internalCommandId, payload = {}) {
  const route = routeByInternalCommand[internalCommandId];
  if (!route) {
    return blockedResult(internalCommandId, [`Unknown ThinkIO plugin command: ${internalCommandId}.`]);
  }

  if (route.mutatesCanonicalState && !payload.approvalId) {
    return {
      ok: false,
      status: "approval-required",
      commandId: internalCommandId,
      runtimeAction: route.runtimeAction,
      blockers: [`${internalCommandId} requires approval before canonical mutation.`],
      proposal: route.producesProposal ? createProposal(internalCommandId, payload) : undefined
    };
  }

  if (route.producesProposal) {
    return {
      ok: true,
      status: "proposal-created",
      commandId: internalCommandId,
      runtimeAction: route.runtimeAction,
      blockers: [],
      proposal: createProposal(internalCommandId, payload)
    };
  }

  return {
    ok: true,
    status: route.mutatesCanonicalState ? "applied" : "ok",
    commandId: internalCommandId,
    runtimeAction: route.runtimeAction,
    blockers: []
  };
}

export async function readProjection(workspaceRoot, viewKind) {
  const file = projectionFiles[viewKind];
  if (!file) {
    return { ok: false, blockers: [`Unknown ThinkIO projection view: ${viewKind}.`] };
  }

  try {
    const raw = await readFile(new URL(file, `file:///${workspaceRoot.replaceAll("\\", "/")}/`), "utf8");
    return { ok: true, data: JSON.parse(raw), blockers: [] };
  } catch (error) {
    return { ok: false, blockers: [`Unable to read ${file}: ${error.message}`] };
  }
}

function createProposal(commandId, payload) {
  return {
    id: payload.proposalId ?? `PROPOSAL-${Date.now()}`,
    commandId,
    payload,
    canonicalStateMutation: false
  };
}

function blockedResult(commandId, blockers) {
  return {
    ok: false,
    status: "blocked",
    commandId,
    blockers
  };
}

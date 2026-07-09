import type {
  ContextCard,
  FrictionSignal,
  GovernedTask,
  NativeBoardProjection,
  RuntimeMindmapProjection,
  ValidationStageResult,
  Workboard,
  WorkPackage,
  ProviderOutputRecord,
  DerivationRecord
} from "./types.ts";

export function buildNativeBoardProjection(input: {
  id: string;
  tasks: GovernedTask[];
  workboard: Workboard;
  validationResults?: ValidationStageResult[];
  frictionSignals?: FrictionSignal[];
}): NativeBoardProjection {
  const validationBlockers = new Map(
    (input.validationResults ?? []).map((result) => [result.id, result.blockers])
  );
  const frictionByTask = groupFrictionByTask(input.frictionSignals ?? []);
  const lanes: NativeBoardProjection["lanes"] = {};

  for (const task of [...input.tasks].sort((a, b) => a.id.localeCompare(b.id))) {
    const step = input.workboard.steps.find((candidate) => candidate.taskId === task.id);
    const lane = step?.workflowPosition ?? task.status;
    const card = {
      id: step?.id ?? task.id,
      taskId: task.id,
      title: step?.title ?? task.title,
      lane,
      order: step?.order ?? 0,
      authority: task.authority,
      blockers: [...(validationBlockers.get(task.id) ?? [])],
      dependencyIds: [...task.dependencies],
      frictionSignalIds: frictionByTask.get(task.id) ?? []
    };

    lanes[lane] = [...(lanes[lane] ?? []), card].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  }

  return {
    id: input.id,
    lanes,
    actions: [
      { action: "move-card", runtimeCommand: "evaluate-governance-decision", requiresApproval: true },
      { action: "open-task", runtimeCommand: "build-context-packet", requiresApproval: false },
      { action: "attach-context", runtimeCommand: "evaluate-governance-decision", requiresApproval: false },
      { action: "request-approval", runtimeCommand: "evaluate-governance-decision", requiresApproval: false },
      { action: "refresh-projection", runtimeCommand: "update-views", requiresApproval: false }
    ]
  };
}

export function buildRuntimeMindmapProjection(input: {
  tasks: GovernedTask[];
  workboard?: Workboard;
  contextCards?: ContextCard[];
  frictionSignals?: FrictionSignal[];
  workPackages?: WorkPackage[];
  providerOutputs?: ProviderOutputRecord[];
  derivations?: DerivationRecord[];
  validationResults?: ValidationStageResult[];
}): RuntimeMindmapProjection {
  const nodes: RuntimeMindmapProjection["nodes"] = [];
  const edges: RuntimeMindmapProjection["edges"] = [];

  for (const task of input.tasks) {
    nodes.push({ id: task.id, kind: "task", label: task.title });
    for (const dependency of task.dependencies) {
      edges.push({ from: task.id, to: dependency, kind: "depends-on" });
    }
  }

  for (const step of input.workboard?.steps ?? []) {
    nodes.push({ id: step.id, kind: "step", label: step.title });
    edges.push({ from: step.id, to: step.taskId, kind: "attached-to" });
  }

  for (const card of input.contextCards ?? []) {
    nodes.push({ id: card.id, kind: "context-card", label: card.type });
    edges.push({ from: card.id, to: card.attachment.id, kind: "attached-to" });
  }

  for (const signal of input.frictionSignals ?? []) {
    nodes.push({ id: signal.id, kind: "friction", label: signal.pattern });
    if (signal.taskId) edges.push({ from: signal.id, to: signal.taskId, kind: "blocks" });
  }

  for (const workPackage of input.workPackages ?? []) {
    nodes.push({ id: workPackage.id, kind: "work-package", label: workPackage.intent });
    if (workPackage.taskId) edges.push({ from: workPackage.id, to: workPackage.taskId, kind: "exports-to" });
  }

  for (const output of input.providerOutputs ?? []) {
    nodes.push({ id: output.id, kind: "provider-output", label: output.outputClass });
    edges.push({ from: output.id, to: output.workPackageId, kind: "ingests-from" });
  }

  for (const derivation of input.derivations ?? []) {
    nodes.push({ id: derivation.id, kind: "derivation", label: derivation.classification });
    for (const source of derivation.sourceRefs) edges.push({ from: derivation.id, to: source, kind: "derived-from" });
    for (const target of derivation.targetRefs) edges.push({ from: derivation.id, to: target, kind: "promotes-to" });
  }

  for (const validation of input.validationResults ?? []) {
    nodes.push({ id: validation.id, kind: "validation-run", label: validation.stage });
  }

  return {
    nodes: sortById(nodes),
    edges: [...edges].sort((a, b) => `${a.from}:${a.to}:${a.kind}`.localeCompare(`${b.from}:${b.to}:${b.kind}`))
  };
}

function groupFrictionByTask(signals: FrictionSignal[]): Map<string, string[]> {
  const grouped = new Map<string, string[]>();

  for (const signal of signals) {
    if (!signal.taskId) continue;
    grouped.set(signal.taskId, [...(grouped.get(signal.taskId) ?? []), signal.id].sort());
  }

  return grouped;
}

function sortById<T extends { id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.id.localeCompare(b.id));
}

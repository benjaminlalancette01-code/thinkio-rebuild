import { TASK_STATUSES, type GovernedTask, type TaskStatus } from "./types.ts";

export interface ProjectGraphNode {
  id: string;
  type: string;
  label: string;
}

export interface ProjectGraphEdge {
  from: string;
  to: string;
  label: string;
}

export interface ProjectGraph {
  nodes: ProjectGraphNode[];
  edges: ProjectGraphEdge[];
}

export interface DeferredSummaryItem {
  taskId: string;
  status: string;
}

export interface KanbanView {
  columns: Record<TaskStatus, string[]>;
}

export interface MindmapView {
  nodes: Array<{
    id: string;
    label: string;
    kind: string;
    status?: TaskStatus;
    authority?: string;
  }>;
  edges: ProjectGraphEdge[];
}

export interface DashboardView {
  activeTaskCount: number;
  blockedTaskCount: number;
  candidateCount: number;
  acceptedCount: number;
  frozenCount: number;
  executableCount: number;
  doneCount: number;
  archivedCount: number;
  rejectedCount: number;
}

export function buildProjectGraphFromTasks(tasks: GovernedTask[], baseGraph: ProjectGraph = { nodes: [], edges: [] }): ProjectGraph {
  const taskIds = new Set(tasks.map((task) => task.id));
  const taskNodes = sortedTasks(tasks).map((task) => ({ id: task.id, type: "task", label: task.title }));
  const nonTaskNodes = baseGraph.nodes
    .filter((node) => !taskIds.has(node.id))
    .sort((a, b) => a.id.localeCompare(b.id));

  return {
    nodes: [...taskNodes, ...nonTaskNodes],
    edges: buildDependencyEdges(tasks, {
      nodes: [...taskNodes, ...nonTaskNodes],
      edges: baseGraph.edges.filter((edge) => !isTaskDependencyEdge(edge, taskIds))
    })
  };
}

export function explainProjectGraphCoverageBlockers(tasks: GovernedTask[], graph: ProjectGraph): string[] {
  const blockers: string[] = [];
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const edgeKeys = new Set(graph.edges.map(edgeKey));

  for (const task of sortedTasks(tasks)) {
    const node = graph.nodes.find((candidate) => candidate.id === task.id);

    if (!node) {
      blockers.push(`Project graph is missing task node ${task.id}.`);
    } else if (node.type !== "task") {
      blockers.push(`Project graph node ${task.id} must use type task.`);
    } else if (node.label !== task.title) {
      blockers.push(`Project graph node ${task.id} label is stale.`);
    }

    for (const dependency of task.dependencies) {
      const edge = { from: task.id, to: dependency, label: "depends-on" };
      if (!edgeKeys.has(edgeKey(edge))) {
        blockers.push(`Project graph is missing dependency edge ${task.id} -> ${dependency}.`);
      }
      if (!nodeIds.has(dependency)) {
        blockers.push(`Project graph dependency target ${dependency} is missing for ${task.id}.`);
      }
    }
  }

  return blockers;
}

export function validateProjectGraphCoverage(tasks: GovernedTask[], graph: ProjectGraph): boolean {
  return explainProjectGraphCoverageBlockers(tasks, graph).length === 0;
}

export function buildKanbanView(tasks: GovernedTask[]): KanbanView {
  const columns = createStatusArrayBuckets();

  for (const task of sortedTasks(tasks)) {
    columns[task.status].push(task.id);
  }

  return { columns };
}

export function buildMindmapView(tasks: GovernedTask[], graph: ProjectGraph): MindmapView {
  const graphNodesById = new Map(graph.nodes.map((node) => [node.id, node]));
  const taskNodes = sortedTasks(tasks).map((task) => {
    const graphNode = graphNodesById.get(task.id);

    return {
      id: task.id,
      label: graphNode?.label ?? task.title,
      kind: graphNode?.type ?? "task",
      status: task.status,
      authority: task.authority
    };
  });

  const nonTaskNodes = graph.nodes
    .filter((node) => !tasks.some((task) => task.id === node.id))
    .map((node) => ({
      id: node.id,
      label: node.label,
      kind: node.type
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return {
    nodes: [...taskNodes, ...nonTaskNodes],
    edges: buildDependencyEdges(tasks, graph)
  };
}

export function buildDashboardView(tasks: GovernedTask[], deferredItems: DeferredSummaryItem[] = []): DashboardView {
  const countByStatus = createStatusCountBuckets();

  for (const task of tasks) {
    countByStatus[task.status] += 1;
  }

  return {
    activeTaskCount: tasks.filter((task) => !["done", "rejected", "archived"].includes(task.status)).length,
    blockedTaskCount: deferredItems.filter((item) => item.status === "deferred").length,
    candidateCount: countByStatus.candidate,
    acceptedCount: countByStatus.accepted,
    frozenCount: countByStatus.frozen,
    executableCount: countByStatus.executable,
    doneCount: countByStatus.done,
    archivedCount: countByStatus.archived,
    rejectedCount: countByStatus.rejected
  };
}

function buildDependencyEdges(tasks: GovernedTask[], graph: ProjectGraph): ProjectGraphEdge[] {
  const edgeKeys = new Set<string>();
  const edges: ProjectGraphEdge[] = [];

  for (const edge of graph.edges) {
    edgeKeys.add(edgeKey(edge));
    edges.push(edge);
  }

  for (const task of sortedTasks(tasks)) {
    for (const dependency of task.dependencies) {
      const edge = { from: task.id, to: dependency, label: "depends-on" };
      const key = edgeKey(edge);

      if (!edgeKeys.has(key)) {
        edgeKeys.add(key);
        edges.push(edge);
      }
    }
  }

  return edges.sort((a, b) => `${a.from}:${a.to}:${a.label}`.localeCompare(`${b.from}:${b.to}:${b.label}`));
}

function isTaskDependencyEdge(edge: ProjectGraphEdge, taskIds: Set<string>): boolean {
  return edge.label === "depends-on" && taskIds.has(edge.from);
}

function edgeKey(edge: ProjectGraphEdge): string {
  return `${edge.from}\0${edge.to}\0${edge.label}`;
}

function sortedTasks(tasks: GovernedTask[]): GovernedTask[] {
  return [...tasks].sort((a, b) => a.id.localeCompare(b.id));
}

function createStatusArrayBuckets(): Record<TaskStatus, string[]> {
  const buckets = {} as Record<TaskStatus, string[]>;

  for (const status of TASK_STATUSES) {
    buckets[status] = [];
  }

  return buckets;
}

function createStatusCountBuckets(): Record<TaskStatus, number> {
  const buckets = {} as Record<TaskStatus, number>;

  for (const status of TASK_STATUSES) {
    buckets[status] = 0;
  }

  return buckets;
}

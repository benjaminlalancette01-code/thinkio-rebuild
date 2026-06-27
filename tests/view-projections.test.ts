import test from "node:test";
import assert from "node:assert/strict";
import type { GovernedTask } from "../kernel/types.ts";
import {
  buildDashboardView,
  buildKanbanView,
  buildMindmapView,
  type ProjectGraph
} from "../kernel/view-projections.ts";

const tasks: GovernedTask[] = [
  {
    id: "TASK-001",
    title: "Bootstrap kernel",
    mode: "build",
    status: "done",
    authority: "accepted",
    dependencies: [],
    allowedContext: [],
    blockedContext: [],
    requiredEvidence: [],
    promotionRule: "all-required-evidence-present",
    checkpointRequired: true
  },
  {
    id: "TASK-008",
    title: "Generate views",
    mode: "plan",
    status: "candidate",
    authority: "candidate",
    dependencies: ["TASK-001"],
    allowedContext: [],
    blockedContext: [],
    requiredEvidence: [],
    promotionRule: "all-required-evidence-present",
    checkpointRequired: true
  }
];

const graph: ProjectGraph = {
  nodes: [
    { id: "TASK-001", type: "task", label: "Bootstrap kernel" },
    { id: "TASK-008", type: "task", label: "Generate views" }
  ],
  edges: []
};

test("builds kanban columns from task status", () => {
  assert.deepEqual(buildKanbanView(tasks).columns.done, ["TASK-001"]);
  assert.deepEqual(buildKanbanView(tasks).columns.candidate, ["TASK-008"]);
});

test("builds dashboard counts from task and deferred state", () => {
  assert.deepEqual(buildDashboardView(tasks, [{ taskId: "TASK-008", status: "deferred" }]), {
    activeTaskCount: 1,
    blockedTaskCount: 1,
    candidateCount: 1,
    acceptedCount: 0,
    frozenCount: 0,
    executableCount: 0,
    doneCount: 1,
    archivedCount: 0,
    rejectedCount: 0
  });
});

test("builds mindmap dependency edges from task graph and task dependencies", () => {
  assert.deepEqual(buildMindmapView(tasks, graph).edges, [
    { from: "TASK-008", to: "TASK-001", label: "depends-on" }
  ]);
});


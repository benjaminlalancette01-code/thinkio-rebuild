import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import type { GovernedTask } from "../kernel/types.ts";
import {
  buildDashboardView,
  buildKanbanView,
  buildMindmapView,
  buildProjectGraphFromTasks,
  explainProjectGraphCoverageBlockers,
  validateProjectGraphCoverage,
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
    status: "done",
    authority: "accepted",
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
  assert.deepEqual(buildKanbanView(tasks).columns.done, ["TASK-001", "TASK-008"]);
  assert.deepEqual(buildKanbanView(tasks).columns.candidate, []);
});

test("builds dashboard counts from task and deferred state", () => {
  assert.deepEqual(buildDashboardView(tasks, [{ taskId: "TASK-008", status: "deferred" }]), {
    activeTaskCount: 0,
    blockedTaskCount: 1,
    candidateCount: 0,
    acceptedCount: 0,
    frozenCount: 0,
    executableCount: 0,
    doneCount: 2,
    archivedCount: 0,
    rejectedCount: 0
  });
});

test("builds mindmap dependency edges from task graph and task dependencies", () => {
  assert.deepEqual(buildMindmapView(tasks, graph).edges, [
    { from: "TASK-008", to: "TASK-001", label: "depends-on" }
  ]);
});

test("builds project graph coverage from governed tasks", () => {
  const generated = buildProjectGraphFromTasks(tasks, {
    nodes: [{ id: "DOC-001", type: "document", label: "Reference" }],
    edges: [{ from: "DOC-001", to: "TASK-001", label: "references" }]
  });

  assert.deepEqual(
    generated.nodes.filter((node) => node.type === "task").map((node) => node.id),
    ["TASK-001", "TASK-008"]
  );
  assert.ok(generated.nodes.some((node) => node.id === "DOC-001"));
  assert.ok(generated.edges.some((edge) => edge.from === "TASK-008" && edge.to === "TASK-001"));
  assert.ok(generated.edges.some((edge) => edge.from === "DOC-001" && edge.to === "TASK-001"));
  assert.equal(validateProjectGraphCoverage(tasks, generated), true);
});

test("detects stale project graph task nodes and dependency edges", () => {
  const blockers = explainProjectGraphCoverageBlockers(tasks, {
    nodes: [{ id: "TASK-001", type: "task", label: "Old label" }],
    edges: []
  });

  assert.ok(blockers.some((blocker) => blocker.includes("TASK-001 label is stale")));
  assert.ok(blockers.some((blocker) => blocker.includes("missing task node TASK-008")));
  assert.ok(blockers.some((blocker) => blocker.includes("missing dependency edge TASK-008 -> TASK-001")));
  assert.equal(validateProjectGraphCoverage(tasks, { nodes: [], edges: [] }), false);
});

test("runtime flow visual support reflects completed audit tasks", async () => {
  const runtimeFlow = JSON.parse(
    await readFile("views/thinkio-runtime-flow.json", "utf8")
  ) as {
    system: {
      runtime: {
        localDevRuntime: { status: string; flows: string[] };
        taskRunner: { status: string };
      };
    };
    taskCoverage: Record<string, { currentStatus: string }>;
    missingOrNeedsValidation: {
      governance: Array<{ item: string }>;
      runtime: unknown[];
      schemas: unknown[];
    };
  };

  assert.equal(runtimeFlow.system.runtime.localDevRuntime.status, "implemented");
  assert.equal(runtimeFlow.system.runtime.taskRunner.status, "implemented-guarded");
  assert.equal(runtimeFlow.taskCoverage["TASK-024"].currentStatus, "done");
  assert.equal(runtimeFlow.taskCoverage["TASK-014"].currentStatus, "done");
  assert.equal(runtimeFlow.taskCoverage["TASK-015"].currentStatus, "done");
  assert.equal(runtimeFlow.taskCoverage["TASK-029"].currentStatus, "done");
  assert.equal(runtimeFlow.taskCoverage["TASK-051"].currentStatus, "done");
  assert.equal(runtimeFlow.missingOrNeedsValidation.schemas.length, 0);
  assert.equal(runtimeFlow.missingOrNeedsValidation.runtime.length, 0);
  assert.equal(
    runtimeFlow.missingOrNeedsValidation.governance.some((item) => item.item === "Approval flow"),
    false
  );
  assert.ok(
    runtimeFlow.system.runtime.localDevRuntime.flows.some((flow) =>
      flow.includes("planMutationTransactionFromState")
    )
  );
});

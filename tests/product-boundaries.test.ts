import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import type { GovernedTask } from "../kernel/types.ts";
import { buildKanbanView, buildMindmapView, type ProjectGraph } from "../kernel/view-projections.ts";

test("VS Code plugin boundary defers full-app chatbox behind runtime truth", async () => {
  const note = await readFile("docs/vscode-plugin-runtime-shell.md", "utf8");

  assert.match(note, /current product shell for ThinkIO is a VS Code plugin/);
  assert.match(note, /full standalone app can come later/);
  assert.match(note, /work package/);
  assert.match(note, /Chat sessions are not canonical state/);
});

test("product runtime boundary chooses plugin-first MVP scope", async () => {
  const note = await readFile("docs/product-runtime-boundary.md", "utf8");

  assert.match(note, /VS Code plugin packaging/);
  assert.match(note, /Persistent daemon as a requirement for MVP/);
  assert.match(note, /Autonomous replay that mutates project state without user approval/);
});

test("glossary defines governor orchestrator model without runtime metrics drift", async () => {
  const glossary = await readFile("docs/glossary.md", "utf8");

  assert.match(glossary, /## Governor/);
  assert.match(glossary, /## Orchestrator/);
  assert.match(glossary, /## Model/);
  assert.match(glossary, /not kernel metrics/);
});

test("geometry boundary keeps projection metadata out of task authority", async () => {
  const note = await readFile("docs/geometry-projection-boundary.md", "utf8");
  const tasks: GovernedTask[] = [
    {
      id: "TASK-GEOMETRY",
      title: "Geometry should not govern",
      mode: "plan",
      status: "candidate",
      authority: "candidate",
      dependencies: [],
      allowedContext: [],
      blockedContext: [],
      requiredEvidence: [],
      promotionRule: "all-required-evidence-present",
      checkpointRequired: true
    }
  ];
  const graph: ProjectGraph = {
    nodes: [{ id: "TASK-GEOMETRY", type: "task", label: "Geometry should not govern" }],
    edges: [{ from: "TASK-GEOMETRY", to: "GEOMETRY-HINT", label: "visual-hint" }]
  };

  assert.match(note, /must not define task authority/);
  assert.deepEqual(buildKanbanView(tasks).columns.candidate, ["TASK-GEOMETRY"]);
  assert.equal(buildMindmapView(tasks, graph).nodes[0].authority, "candidate");
  assert.deepEqual(buildMindmapView(tasks, graph).edges, [
    { from: "TASK-GEOMETRY", to: "GEOMETRY-HINT", label: "visual-hint" }
  ]);
});

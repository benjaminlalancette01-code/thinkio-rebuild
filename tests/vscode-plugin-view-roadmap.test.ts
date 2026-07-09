import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("VS Code plugin roadmap requires three native self-contained views", async () => {
  const roadmap = await readFile("docs/vscode-plugin-view-roadmap.md", "utf8");

  assert.match(roadmap, /Task Kanban view/);
  assert.match(roadmap, /Artifact mind-map view/);
  assert.match(roadmap, /Interactive node diagram view/);
  assert.match(roadmap, /must not depend on external Kanban, mind-map, or node-diagram plugins/);
});

test("plugin view roadmap keeps views aligned with ThinkIO runtime truth", async () => {
  const roadmap = await readFile("docs/vscode-plugin-view-roadmap.md", "utf8");

  assert.match(roadmap, /UI projections, not sources of truth/);
  assert.match(roadmap, /Canonical state remains/);
  assert.match(roadmap, /State mutations must go through runtime commands/);
  assert.match(roadmap, /View state must not define task status, authority, evidence, checkpoint validity, or write permission/);
});

test("plugin cross-view commands include mode and task creation actions", async () => {
  const task = await readFile("tasks/TASK-057.define-plugin-cross-view-selection-sync.md", "utf8");

  assert.match(task, /switching mode/);
  assert.match(task, /adding a task/);
  assert.match(task, /saving a task/);
  assert.match(task, /governed task proposals first/);
});

test("plugin interaction work is proposal-first and transcript-bounded", async () => {
  const shell = await readFile("docs/vscode-plugin-runtime-shell.md", "utf8");
  const report = await readFile("audit/v1.1.1-plugin-interaction-emulation-gap-report-2026-07-03.md", "utf8");
  const task059 = await readFile("tasks/TASK-059.add-plugin-interaction-log-boundary-model.md", "utf8");
  const task060 = await readFile("tasks/TASK-060.add-chat-to-task-proposal-pipeline.md", "utf8");
  const task061 = await readFile("tasks/TASK-061.add-plugin-runtime-composer-result-surface.md", "utf8");

  assert.match(shell, /interaction log/);
  assert.match(shell, /must remain separate from/);
  assert.match(shell, /not behave as a generic chatbot transcript/);
  assert.match(report, /TASK-059/);
  assert.match(report, /TASK-060/);
  assert.match(report, /TASK-061/);
  assert.match(task059, /canonical event history/);
  assert.match(task060, /task proposals/);
  assert.match(task061, /generic chat transcript/);
});

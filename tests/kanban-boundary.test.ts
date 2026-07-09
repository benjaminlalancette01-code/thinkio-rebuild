import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Kanban Markdown cards are documented as visual mirrors", async () => {
  const note = await readFile("docs/kanban-markdown-sync-boundary.md", "utf8");

  assert.match(note, /visual mirrors/);
  assert.match(note, /Canonical task state lives in `tasks\/\*\.json`/);
  assert.match(note, /two-way Kanban sync/);
});

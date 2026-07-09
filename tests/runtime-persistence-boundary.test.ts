import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("canonical runtime persistence boundary separates UI state from runtime writes", async () => {
  const doc = await readFile("docs/canonical-runtime-persistence-boundary.md", "utf8");
  const stores = await readFile("extension/interaction/stores.js", "utf8");
  const workspaceState = await readFile("extension/state/workspace-state.js", "utf8");

  assert.match(doc, /UI-Only Plugin State/);
  assert.match(doc, /Proposal And Interaction Evidence/);
  assert.match(doc, /Canonical Runtime State/);
  assert.match(doc, /Webviews cannot skip this path/);
  assert.match(doc, /not yet a direct canonical runtime writer from the UI/);
  assert.match(stores, /canonicalStateMutation: false/);
  assert.match(workspaceState, /selectedRecord/);
  assert.match(workspaceState, /layoutHints/);
});

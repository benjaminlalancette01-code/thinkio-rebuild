import test from "node:test";
import assert from "node:assert/strict";
import {
  allowedLocalDevActions,
  implementedLocalDevActions,
  isAllowedLocalDevAction,
  isImplementedLocalDevAction,
  isReservedLocalDevAction,
  reservedLocalDevActions
} from "../runtime/command-registry.ts";

test("command registry separates implemented and reserved local actions", () => {
  assert.deepEqual(implementedLocalDevActions, [
    "validate-json-task-files",
    "validate-cue-schemas",
    "validate-transitions",
    "apply-mutation-transaction",
    "plan-mutation-transaction",
    "update-views",
    "build-context-packet",
    "build-runtime-readiness-proof",
    "evaluate-governance-decision",
    "collect-validation-blockers",
    "evaluate-file-action-proposal",
    "build-native-board-projection",
    "build-runtime-mindmap-projection",
    "validate-work-package",
    "validate-provider-output-ingest",
    "validate-interaction-surface",
    "run-tests",
    "write-checkpoint"
  ]);
  assert.deepEqual(reservedLocalDevActions, []);

  const classifiedActions = new Set([...implementedLocalDevActions, ...reservedLocalDevActions]);
  assert.deepEqual([...classifiedActions].sort(), [...allowedLocalDevActions].sort());
});

test("command registry reports runtime implementation status", () => {
  assert.equal(isAllowedLocalDevAction("validate-transitions"), true);
  assert.equal(isReservedLocalDevAction("validate-transitions"), false);
  assert.equal(isImplementedLocalDevAction("validate-transitions"), true);
  assert.equal(isImplementedLocalDevAction("update-views"), true);
});

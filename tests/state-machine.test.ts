import test from "node:test";
import assert from "node:assert/strict";
import { allowedNextStatuses, assertTransitionAllowed, isTransitionAllowed } from "../kernel/state-machine.ts";

test("allows the governed task happy path transitions", () => {
  assert.equal(isTransitionAllowed("idea", "candidate"), true);
  assert.equal(isTransitionAllowed("candidate", "accepted"), true);
  assert.equal(isTransitionAllowed("accepted", "frozen"), true);
  assert.equal(isTransitionAllowed("frozen", "executable"), true);
  assert.equal(isTransitionAllowed("executable", "done"), true);
  assert.equal(isTransitionAllowed("done", "archived"), true);
});

test("blocks unsafe direct promotions", () => {
  assert.equal(isTransitionAllowed("idea", "accepted"), false);
  assert.equal(isTransitionAllowed("candidate", "frozen"), false);
  assert.equal(isTransitionAllowed("accepted", "executable"), false);
  assert.equal(isTransitionAllowed("idea", "executable"), false);
  assert.equal(isTransitionAllowed("archived", "candidate"), false);
  assert.throws(() => assertTransitionAllowed("accepted", "executable"), /blocked/);
});

test("lists allowed next statuses", () => {
  assert.deepEqual(allowedNextStatuses("candidate"), ["accepted", "rejected"]);
});


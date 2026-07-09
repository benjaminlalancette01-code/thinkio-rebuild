import test from "node:test";
import assert from "node:assert/strict";
import {
  allowedNextAuthorities,
  allowedNextStatuses,
  assertAuthorityTransitionAllowed,
  assertTransitionAllowed,
  isAuthorityCompatibleWithStatus,
  isAuthorityTransitionAllowed,
  isTransitionAllowed
} from "../kernel/state-machine.ts";

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

test("models authority transitions separately from status transitions", () => {
  assert.equal(isAuthorityTransitionAllowed("candidate", "accepted"), true);
  assert.equal(isAuthorityTransitionAllowed("accepted", "frozen"), true);
  assert.equal(isAuthorityTransitionAllowed("frozen", "executable"), true);
  assert.equal(isAuthorityTransitionAllowed("executable", "final"), true);
  assert.equal(isAuthorityTransitionAllowed("candidate", "executable"), false);
  assert.throws(() => assertAuthorityTransitionAllowed("candidate", "executable"), /blocked/);
  assert.deepEqual(allowedNextAuthorities("candidate"), ["accepted", "rejected"]);
});

test("checks authority compatibility with task status", () => {
  assert.equal(isAuthorityCompatibleWithStatus("candidate", "candidate"), true);
  assert.equal(isAuthorityCompatibleWithStatus("final", "done"), true);
  assert.equal(isAuthorityCompatibleWithStatus("accepted", "done"), true);
  assert.equal(isAuthorityCompatibleWithStatus("executable", "done"), false);
});

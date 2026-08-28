import assert from "node:assert/strict";
import test from "node:test";
import {
  createAdminSessionToken,
  isValidAdminSessionToken,
  passwordsMatch,
} from "./adminSession.ts";

const secret = "phase-a-test-secret-with-at-least-32-characters";
const now = Date.UTC(2026, 7, 28, 12, 0, 0);

test("signed admin sessions validate before expiry", () => {
  const token = createAdminSessionToken(secret, now);
  assert.equal(isValidAdminSessionToken(token, secret, now + 60_000), true);
});

test("tampered admin sessions are rejected", () => {
  const token = createAdminSessionToken(secret, now);
  assert.equal(isValidAdminSessionToken(`${token}tampered`, secret, now + 60_000), false);
});

test("expired admin sessions are rejected", () => {
  const token = createAdminSessionToken(secret, now);
  assert.equal(isValidAdminSessionToken(token, secret, now + 9 * 60 * 60 * 1000), false);
});

test("password comparison reports exact matches", () => {
  assert.equal(passwordsMatch("correct horse", "correct horse"), true);
  assert.equal(passwordsMatch("correct horse", "incorrect horse"), false);
});

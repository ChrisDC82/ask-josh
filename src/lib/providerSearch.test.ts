import assert from "node:assert/strict";
import test from "node:test";
import { providers, SUPPORTED_LOCATION } from "../data/providers.ts";
import { searchProviders } from "./providerSearch.ts";

test("blank service queries never match the first catalogue item", () => {
  const result = searchProviders(providers, "   ", SUPPORTED_LOCATION, SUPPORTED_LOCATION);
  assert.equal(result.reason, "service_required");
  assert.deepEqual(result.matches, []);
});

test("service keywords return grounded catalogue matches", () => {
  const result = searchProviders(
    providers,
    "There is a leaking pipe",
    SUPPORTED_LOCATION,
    SUPPORTED_LOCATION,
  );
  assert.equal(result.reason, "matches_found");
  assert.equal(result.matches[0]?.category, "Plumbing");
});

test("broad repair searches can return multiple relevant services", () => {
  const result = searchProviders(providers, "repair", SUPPORTED_LOCATION, SUPPORTED_LOCATION);
  assert.equal(result.reason, "matches_found");
  assert.ok(result.matches.length > 1);
});

test("unsupported locations do not produce false coverage", () => {
  const result = searchProviders(providers, "plumbing", "Port of Spain", SUPPORTED_LOCATION);
  assert.equal(result.reason, "unsupported_location");
  assert.deepEqual(result.matches, []);
});

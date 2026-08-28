import assert from "node:assert/strict";
import test from "node:test";
import {
  FIND_MAINTENANCE_SERVICES_MAX_LIMIT,
  findMaintenanceServices,
} from "./webMcpMaintenanceServices.ts";

const privateFields = [
  "id",
  "phone",
  "phone_href",
  "email",
  "contact_verified",
  "keywords",
  "call_to_action",
];

test("find_maintenance_services returns a grounded plumbing result", () => {
  const result = findMaintenanceServices({ query: "There is a leaking pipe" });
  assert.equal(result.success, true);
  assert.equal(result.results[0]?.category, "Plumbing");
  assert.equal(result.results[0]?.provider_name, "Laughlin Maintenance Services");
});

test("find_maintenance_services returns a grounded electrical result", () => {
  const result = findMaintenanceServices({ query: "outlet and light switch repair" });
  assert.equal(result.success, true);
  assert.equal(result.results[0]?.category, "Electrical repairs");
});

test("find_maintenance_services can return multiple repair matches", () => {
  const result = findMaintenanceServices({ query: "repair", limit: 5 });
  assert.equal(result.success, true);
  assert.ok(result.results.length > 1);
});

test("find_maintenance_services handles blank queries safely", () => {
  const result = findMaintenanceServices({ query: "   " });
  assert.equal(result.success, false);
  assert.equal(result.reason, "service_required");
  assert.deepEqual(result.results, []);
});

test("find_maintenance_services does not claim unsupported locations", () => {
  const result = findMaintenanceServices({ query: "plumbing", location: "Port of Spain" });
  assert.equal(result.success, false);
  assert.equal(result.reason, "unsupported_location");
  assert.deepEqual(result.results, []);
});

test("find_maintenance_services reports no result without inventing data", () => {
  const result = findMaintenanceServices({ query: "security camera installation" });
  assert.equal(result.success, false);
  assert.equal(result.reason, "no_matches");
  assert.deepEqual(result.results, []);
});

test("find_maintenance_services respects the requested result limit", () => {
  const result = findMaintenanceServices({ query: "repair", limit: 2 });
  assert.equal(result.results.length, 2);
  assert.equal(result.applied_limit, 2);
});

test("find_maintenance_services caps excessive result limits", () => {
  const result = findMaintenanceServices({ query: "repair", limit: 50 });
  assert.equal(result.applied_limit, FIND_MAINTENANCE_SERVICES_MAX_LIMIT);
  assert.ok(result.results.length <= FIND_MAINTENANCE_SERVICES_MAX_LIMIT);
});

test("find_maintenance_services returns structured public fields only", () => {
  const result = findMaintenanceServices({ query: "plumbing" });
  const service = result.results[0];

  assert.ok(service);
  assert.equal(typeof service.service_id, "string");
  assert.equal(typeof service.provider_name, "string");
  assert.equal(typeof service.category, "string");
  assert.equal(typeof service.location, "string");
  assert.equal(typeof service.summary, "string");
  assert.equal(typeof service.typical_service, "string");
  assert.equal(typeof service.estimated_cost_range, "string");
  assert.match(service.estimate_note, /Indicative range only/);

  for (const field of privateFields) {
    assert.equal(Object.hasOwn(service, field), false, `${field} should not be exposed`);
  }
});

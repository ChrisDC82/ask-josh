import assert from "node:assert/strict";
import test from "node:test";
import {
  FIND_MAINTENANCE_SERVICES_MAX_LIMIT,
  findMaintenanceServices,
  getMaintenanceServiceDetails,
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

test("get_maintenance_service_details returns the plumbing service by exact ID", () => {
  const result = getMaintenanceServiceDetails({ service_id: "askjosh-service-2" });
  assert.equal(result.success, true);
  assert.equal(result.reason, "details_found");
  assert.equal(result.service_id, "askjosh-service-2");
  assert.equal(result.category, "Plumbing");
});

test("get_maintenance_service_details returns the electrical service by exact ID", () => {
  const result = getMaintenanceServiceDetails({ service_id: "askjosh-service-3" });
  assert.equal(result.success, true);
  assert.equal(result.category, "Electrical repairs");
});

test("get_maintenance_service_details handles unknown service IDs", () => {
  const result = getMaintenanceServiceDetails({ service_id: "askjosh-service-999" });
  assert.equal(result.success, false);
  assert.equal(result.reason, "not_found");
  assert.equal(result.category, "");
});

test("get_maintenance_service_details handles blank service IDs", () => {
  const result = getMaintenanceServiceDetails({ service_id: "   " });
  assert.equal(result.success, false);
  assert.equal(result.reason, "service_id_required");
  assert.equal(result.available_contact_actions.length, 0);
});

test("get_maintenance_service_details does not use ambiguous matching", () => {
  const result = getMaintenanceServiceDetails({ service_id: "Plumbing" });
  assert.equal(result.success, false);
  assert.equal(result.reason, "not_found");
});

test("get_maintenance_service_details returns expected public fields and indicative language", () => {
  const result = getMaintenanceServiceDetails({ service_id: "askjosh-service-2" });

  assert.equal(typeof result.provider_name, "string");
  assert.equal(typeof result.description, "string");
  assert.equal(typeof result.typical_service, "string");
  assert.equal(typeof result.estimated_cost_range, "string");
  assert.equal(result.supported_location, "La Brea");
  assert.match(result.estimate_note, /Indicative range only/);
  assert.match(result.contact_verification_note, /pending owner verification/);
  assert.deepEqual(
    result.available_contact_actions.map((action) => action.type),
    ["phone", "email", "quote_email_draft"],
  );
});

test("get_maintenance_service_details exposes no admin, env, or internal-only fields", () => {
  const result = getMaintenanceServiceDetails({ service_id: "askjosh-service-2" });
  const serialized = JSON.stringify(result);

  assert.equal(/SUPABASE|SERVICE_ROLE|ADMIN_PASSWORD|ADMIN_SESSION/.test(serialized), false);
  for (const field of ["id", "keywords", "call_to_action"]) {
    assert.equal(Object.hasOwn(result, field), false, `${field} should not be exposed`);
  }
});

test("find_maintenance_services service IDs feed get_maintenance_service_details", () => {
  const search = findMaintenanceServices({ query: "leaking pipe", location: "La Brea" });
  const serviceId = search.results[0]?.service_id;

  assert.equal(serviceId, "askjosh-service-2");
  const details = getMaintenanceServiceDetails({ service_id: serviceId });
  assert.equal(details.success, true);
  assert.equal(details.category, search.results[0]?.category);
});

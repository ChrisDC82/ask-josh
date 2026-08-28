import assert from "node:assert/strict";
import test from "node:test";
import {
  BUILD_PROPERTY_MAINTENANCE_PLAN_MAX_SERVICES,
  FIND_MAINTENANCE_SERVICES_MAX_LIMIT,
  buildPropertyMaintenancePlan,
  buildPropertyMaintenancePlanInputSchema,
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

test("build_property_maintenance_plan creates a single-service grounded draft", () => {
  const result = buildPropertyMaintenancePlan({ service_ids: ["askjosh-service-1"] });

  assert.equal(result.success, true);
  assert.equal(result.reason, "plan_created");
  assert.equal(result.plan_status, "draft");
  assert.equal(result.services.length, 1);
  assert.equal(result.services[0]?.category, "AC repair and maintenance");
});

test("build_property_maintenance_plan creates a deterministic multi-service sequence", () => {
  const result = buildPropertyMaintenancePlan({
    service_ids: ["askjosh-service-2", "askjosh-service-3"],
    priority: "soon",
  });

  assert.equal(result.success, true);
  assert.equal(result.priority, "soon");
  assert.deepEqual(
    result.services.map((service) => service.service_id),
    ["askjosh-service-3", "askjosh-service-2"],
  );
  assert.deepEqual(
    result.services.map((service) => service.suggested_sequence),
    [1, 2],
  );
});

test("build_property_maintenance_plan supports the four-service community-centre scenario", () => {
  const result = buildPropertyMaintenancePlan({
    service_ids: [
      "askjosh-service-1",
      "askjosh-service-3",
      "askjosh-service-5",
      "askjosh-service-6",
    ],
    location: "La Brea",
    project_summary: "Preparing a community centre for routine use.",
  });

  assert.equal(result.success, true);
  assert.deepEqual(
    result.services.map((service) => service.category),
    ["Electrical repairs", "AC repair and maintenance", "Pressure washing", "Lawn care"],
  );
  assert.equal(result.combined_estimated_range, "TTD $1,250-$4,150");
});

test("build_property_maintenance_plan removes duplicate service IDs transparently", () => {
  const result = buildPropertyMaintenancePlan({
    service_ids: ["askjosh-service-2", "askjosh-service-2"],
  });

  assert.equal(result.success, true);
  assert.equal(result.services.length, 1);
  assert.deepEqual(result.duplicate_service_ids, ["askjosh-service-2"]);
});

test("build_property_maintenance_plan identifies an invalid ID among valid IDs", () => {
  const result = buildPropertyMaintenancePlan({
    service_ids: ["askjosh-service-2", "askjosh-service-999"],
  });

  assert.equal(result.success, false);
  assert.equal(result.reason, "partial_plan");
  assert.equal(result.plan_status, "draft_with_invalid_service_ids");
  assert.deepEqual(result.unmatched_or_invalid_service_ids, ["askjosh-service-999"]);
  assert.deepEqual(result.services.map((service) => service.service_id), ["askjosh-service-2"]);
});

test("build_property_maintenance_plan rejects all-invalid service IDs without substitution", () => {
  const result = buildPropertyMaintenancePlan({
    service_ids: ["askjosh-service-998", "askjosh-service-999"],
  });

  assert.equal(result.success, false);
  assert.equal(result.reason, "no_valid_service_ids");
  assert.deepEqual(result.services, []);
  assert.deepEqual(result.unmatched_or_invalid_service_ids, [
    "askjosh-service-998",
    "askjosh-service-999",
  ]);
});

test("build_property_maintenance_plan requires a non-empty service array", () => {
  const result = buildPropertyMaintenancePlan({ service_ids: [] });

  assert.equal(result.success, false);
  assert.equal(result.reason, "service_ids_required");
  assert.deepEqual(result.services, []);
});

test("build_property_maintenance_plan accepts the maximum service count", () => {
  const serviceIds = Array.from(
    { length: BUILD_PROPERTY_MAINTENANCE_PLAN_MAX_SERVICES },
    (_, index) => `askjosh-service-${index + 1}`,
  );
  const result = buildPropertyMaintenancePlan({ service_ids: serviceIds });

  assert.equal(result.success, true);
  assert.equal(result.services.length, BUILD_PROPERTY_MAINTENANCE_PLAN_MAX_SERVICES);
});

test("build_property_maintenance_plan rejects an over-maximum service count", () => {
  const serviceIds = Array.from(
    { length: BUILD_PROPERTY_MAINTENANCE_PLAN_MAX_SERVICES + 1 },
    (_, index) => `askjosh-service-${index + 1}`,
  );
  const result = buildPropertyMaintenancePlan({ service_ids: serviceIds });

  assert.equal(result.success, false);
  assert.equal(result.reason, "too_many_services");
  assert.deepEqual(result.services, []);
});

test("build_property_maintenance_plan does not claim unsupported locations", () => {
  const result = buildPropertyMaintenancePlan({
    service_ids: ["askjosh-service-2"],
    location: "Port of Spain",
  });

  assert.equal(result.success, false);
  assert.equal(result.reason, "unsupported_location");
  assert.equal(result.supported_location, "La Brea");
  assert.deepEqual(result.services, []);
});

test("build_property_maintenance_plan returns identical output for identical input", () => {
  const input = {
    service_ids: ["askjosh-service-6", "askjosh-service-3", "askjosh-service-1"],
    project_summary: "Routine shared-property maintenance.",
    priority: "routine",
  };

  assert.deepEqual(buildPropertyMaintenancePlan(input), buildPropertyMaintenancePlan(input));
});

test("build_property_maintenance_plan labels estimates as indicative and non-binding", () => {
  const result = buildPropertyMaintenancePlan({ service_ids: ["askjosh-service-4"] });

  assert.match(result.services[0]?.estimate_note || "", /Indicative range only/);
  assert.match(result.combined_estimate_note, /Indicative, non-binding/);
  assert.match(result.combined_estimate_note, /not a quote/);
});

test("build_property_maintenance_plan safely sums only catalogue cost ranges", () => {
  const result = buildPropertyMaintenancePlan({
    service_ids: ["askjosh-service-2", "askjosh-service-3"],
  });

  assert.equal(result.combined_estimated_range, "TTD $550-$2,100");
  assert.deepEqual(result.excluded_from_combined_estimate, []);
  assert.match(result.combined_estimate_note, /excludes taxes, materials/);
});

test("build_property_maintenance_plan never invents services for invalid IDs", () => {
  const result = buildPropertyMaintenancePlan({
    service_ids: ["askjosh-service-5", "askjosh-service-404"],
  });

  assert.deepEqual(result.services.map((service) => service.service_id), ["askjosh-service-5"]);
  assert.deepEqual(result.services.map((service) => service.category), ["Pressure washing"]);
  assert.deepEqual(result.unmatched_or_invalid_service_ids, ["askjosh-service-404"]);
});

test("build_property_maintenance_plan exposes no private, admin, or environment data", () => {
  const result = buildPropertyMaintenancePlan({
    service_ids: ["askjosh-service-1", "askjosh-service-3"],
    project_summary: "Community centre maintenance.",
  });
  const serialized = JSON.stringify(result);

  assert.equal(
    /SUPABASE|SERVICE_ROLE|ADMIN_PASSWORD|ADMIN_SESSION|phone_href|contact_verified|call_to_action|keywords/.test(
      serialized,
    ),
    false,
  );
  assert.equal(/service@|868-555/.test(serialized), false);
});

test("build_property_maintenance_plan schema accepts no personal-information fields", () => {
  const properties = buildPropertyMaintenancePlanInputSchema.properties;

  assert.equal(buildPropertyMaintenancePlanInputSchema.additionalProperties, false);
  for (const field of ["name", "phone", "email", "address", "payment_information"]) {
    assert.equal(Object.hasOwn(properties, field), false, `${field} should not be accepted`);
  }
});

test("build_property_maintenance_plan treats project summary and urgent priority as context only", () => {
  const result = buildPropertyMaintenancePlan({
    service_ids: ["askjosh-service-3"],
    project_summary: "Urgent electrical concern at a community centre.",
    priority: "urgent",
  });

  assert.equal(result.priority, "urgent");
  assert.match(result.assumptions.join(" "), /do not establish property conditions, emergency status/);
  assert.match(result.assumptions.join(" "), /No service has been booked/);
});

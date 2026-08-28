import { providers, SUPPORTED_LOCATION } from "../data/providers.ts";
import { searchProviders, type SearchReason } from "./providerSearch.ts";

export const FIND_MAINTENANCE_SERVICES_TOOL_NAME = "find_maintenance_services";
export const GET_MAINTENANCE_SERVICE_DETAILS_TOOL_NAME = "get_maintenance_service_details";
export const BUILD_PROPERTY_MAINTENANCE_PLAN_TOOL_NAME = "build_property_maintenance_plan";
export const FIND_MAINTENANCE_SERVICES_MAX_LIMIT = 5;
export const FIND_MAINTENANCE_SERVICES_DEFAULT_LIMIT = 3;
export const BUILD_PROPERTY_MAINTENANCE_PLAN_MAX_SERVICES = 5;
const SERVICE_ID_PREFIX = "askjosh-service-";

export interface FindMaintenanceServicesInput {
  query?: unknown;
  location?: unknown;
  limit?: unknown;
}

export type MaintenancePlanPriority = "routine" | "soon" | "urgent";

export interface MaintenanceServiceToolResult {
  service_id: string;
  provider_name: string;
  category: string;
  location: string;
  summary: string;
  typical_service: string;
  estimated_cost_range: string;
  estimate_note: string;
}

export interface AvailableContactAction {
  type: "phone" | "email" | "quote_email_draft";
  label: string;
  value: string;
  href: string;
  verification_note?: string;
}

export interface GetMaintenanceServiceDetailsResult extends MaintenanceServiceToolResult {
  success: boolean;
  reason: "details_found" | "service_id_required" | "not_found";
  message: string;
  description: string;
  supported_location: string;
  contact_verified: boolean;
  contact_verification_note: string;
  available_contact_actions: AvailableContactAction[];
}

export interface FindMaintenanceServicesResult {
  success: boolean;
  reason: SearchReason | "invalid_limit";
  message: string;
  supported_location: string;
  requested_location: string | null;
  applied_limit: number;
  max_limit: number;
  results: MaintenanceServiceToolResult[];
}

export interface PlannedMaintenanceService extends MaintenanceServiceToolResult {
  suggested_sequence: number;
  planning_note: string;
}

export interface BuildPropertyMaintenancePlanResult {
  success: boolean;
  reason:
    | "plan_created"
    | "partial_plan"
    | "service_ids_required"
    | "too_many_services"
    | "no_valid_service_ids"
    | "unsupported_location";
  message: string;
  plan_status: "draft" | "draft_with_invalid_service_ids" | "not_created";
  location: string;
  supported_location: string;
  project_summary: string | null;
  priority: MaintenancePlanPriority;
  services: PlannedMaintenanceService[];
  unmatched_or_invalid_service_ids: string[];
  duplicate_service_ids: string[];
  combined_estimated_range: string | null;
  combined_estimate_note: string;
  excluded_from_combined_estimate: string[];
  assumptions: string[];
  next_steps: string[];
}

export const findMaintenanceServicesInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    query: {
      type: "string",
      minLength: 1,
      maxLength: 200,
      description:
        "Natural-language description of the maintenance need, such as 'leaking pipe' or 'electrical outlet not working'.",
    },
    location: {
      type: "string",
      maxLength: 100,
      description:
        "Optional service location. AskJosh currently supports only the La Brea catalogue.",
    },
    limit: {
      type: "integer",
      minimum: 1,
      maximum: FIND_MAINTENANCE_SERVICES_MAX_LIMIT,
      description:
        "Optional maximum number of services to return. Values above the maximum are capped.",
    },
  },
  required: ["query"],
} as const;

export const getMaintenanceServiceDetailsInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    service_id: {
      type: "string",
      minLength: 1,
      maxLength: 64,
      description:
        "Stable AskJosh service identifier returned by find_maintenance_services, such as askjosh-service-2.",
    },
  },
  required: ["service_id"],
} as const;

export const buildPropertyMaintenancePlanInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    service_ids: {
      type: "array",
      minItems: 1,
      maxItems: BUILD_PROPERTY_MAINTENANCE_PLAN_MAX_SERVICES,
      items: {
        type: "string",
        minLength: 1,
        maxLength: 64,
      },
      description:
        "One to five exact AskJosh service IDs returned by find_maintenance_services.",
    },
    location: {
      type: "string",
      maxLength: 100,
      description: "Optional planning location. AskJosh currently supports only La Brea.",
    },
    project_summary: {
      type: "string",
      maxLength: 300,
      description:
        "Optional short context for displaying the draft plan. It does not change catalogue facts or establish property conditions.",
    },
    priority: {
      type: "string",
      enum: ["routine", "soon", "urgent"],
      description:
        "Optional presentation priority. It does not establish emergency service or provider availability.",
    },
  },
  required: ["service_ids"],
} as const;

function normalizeLimit(value: unknown) {
  if (value === undefined || value === null) return FIND_MAINTENANCE_SERVICES_DEFAULT_LIMIT;
  if (typeof value !== "number" || !Number.isFinite(value)) return FIND_MAINTENANCE_SERVICES_DEFAULT_LIMIT;
  return Math.min(Math.max(Math.trunc(value), 1), FIND_MAINTENANCE_SERVICES_MAX_LIMIT);
}

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toToolResult(provider: (typeof providers)[number]): MaintenanceServiceToolResult {
  return {
    service_id: serviceIdFor(provider),
    provider_name: provider.name,
    category: provider.category,
    location: provider.location,
    summary: provider.description,
    typical_service: provider.average_service,
    estimated_cost_range: provider.average_cost,
    estimate_note: "Indicative range only. Final price and availability must be confirmed directly with the provider.",
  };
}

function serviceIdFor(provider: (typeof providers)[number]) {
  return `${SERVICE_ID_PREFIX}${provider.id}`;
}

function messageFor(reason: FindMaintenanceServicesResult["reason"], count: number) {
  if (reason === "service_required") return "Enter a maintenance need to search the AskJosh catalogue.";
  if (reason === "unsupported_location") return `AskJosh currently has public catalogue data only for ${SUPPORTED_LOCATION}.`;
  if (reason === "no_matches") return `No matching service was found in the current ${SUPPORTED_LOCATION} catalogue.`;
  return `${count} matching service${count === 1 ? "" : "s"} found in the current ${SUPPORTED_LOCATION} catalogue.`;
}

function isInputRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function findMaintenanceServices(input: unknown): FindMaintenanceServicesResult {
  const safeInput = isInputRecord(input) ? input : {};
  const query = textValue(safeInput.query);
  const location = textValue(safeInput.location);
  const limit = normalizeLimit(safeInput.limit);
  const search = searchProviders(providers, query, location || SUPPORTED_LOCATION, SUPPORTED_LOCATION);
  const results = search.matches.slice(0, limit).map(toToolResult);

  return {
    success: search.reason === "matches_found",
    reason: search.reason,
    message: messageFor(search.reason, results.length),
    supported_location: SUPPORTED_LOCATION,
    requested_location: location || null,
    applied_limit: limit,
    max_limit: FIND_MAINTENANCE_SERVICES_MAX_LIMIT,
    results,
  };
}

export function getMaintenanceServiceDetails(input: unknown): GetMaintenanceServiceDetailsResult {
  const safeInput = isInputRecord(input) ? input : {};
  const serviceId = textValue(safeInput.service_id);

  if (!serviceId) {
    return {
      ...emptyDetails(),
      reason: "service_id_required",
      message: "Provide a service_id returned by find_maintenance_services.",
    };
  }

  const provider = providers.find((entry) => serviceIdFor(entry) === serviceId);

  if (!provider) {
    return {
      ...emptyDetails(),
      reason: "not_found",
      message: `No AskJosh maintenance service was found for service_id ${serviceId}.`,
    };
  }

  const publicService = toToolResult(provider);
  const contactNote = provider.contact_verified
    ? "Provider contact details are marked as verified in the public catalogue."
    : "Provider contact details are public on the website but remain pending owner verification.";

  return {
    ...publicService,
    success: true,
    reason: "details_found",
    message: `${provider.category} details found in the current ${SUPPORTED_LOCATION} catalogue.`,
    description: provider.description,
    supported_location: SUPPORTED_LOCATION,
    contact_verified: provider.contact_verified,
    contact_verification_note: contactNote,
    available_contact_actions: [
      {
        type: "phone",
        label: `Call ${provider.phone}`,
        value: provider.phone,
        href: provider.phone_href,
        verification_note: contactNote,
      },
      {
        type: "email",
        label: "Email provider",
        value: provider.email,
        href: `mailto:${provider.email}`,
        verification_note: contactNote,
      },
      {
        type: "quote_email_draft",
        label: "Prepare quote email draft",
        value: provider.category,
        href: `/providers?service=${encodeURIComponent(provider.category)}`,
      },
    ],
  };
}

function emptyDetails(): GetMaintenanceServiceDetailsResult {
  return {
    success: false,
    reason: "not_found",
    message: "No AskJosh maintenance service was found for that service_id.",
    service_id: "",
    provider_name: "",
    category: "",
    description: "",
    location: SUPPORTED_LOCATION,
    summary: "",
    typical_service: "",
    estimated_cost_range: "",
    estimate_note: "Indicative range only. Final price and availability must be confirmed directly with the provider.",
    supported_location: SUPPORTED_LOCATION,
    contact_verified: false,
    contact_verification_note: "Provider contact details remain pending owner verification.",
    available_contact_actions: [],
  };
}

const maintenanceSequence: Record<string, { rank: number; note: string }> = {
  "Electrical repairs": {
    rank: 10,
    note: "Start with the catalogue's electrical fault inspection and minor-repair scope before cosmetic or cleaning work.",
  },
  Plumbing: {
    rank: 20,
    note: "Address the catalogue's leak inspection and minor-repair scope before cleaning or finishing work.",
  },
  "AC repair and maintenance": {
    rank: 30,
    note: "Schedule the catalogue's AC diagnostic and maintenance scope before final cleaning activities.",
  },
  "Tree cutting": {
    rank: 40,
    note: "Complete the catalogue's tree assessment and cutting scope before nearby surface or lawn work.",
  },
  "General property maintenance": {
    rank: 50,
    note: "Use the catalogue's general inspection and minor-repair scope before finishing activities.",
  },
  "Pressure washing": {
    rank: 60,
    note: "Plan exterior cleaning after relevant inspection or repair work and before painting where both are selected.",
  },
  Painting: {
    rank: 70,
    note: "Plan painting after relevant repairs and exterior cleaning where those services are selected.",
  },
  "Lawn care": {
    rank: 80,
    note: "Place routine lawn and yard cleanup after work likely to create outdoor debris.",
  },
};

function normalizePriority(value: unknown): MaintenancePlanPriority {
  return value === "soon" || value === "urgent" ? value : "routine";
}

function isSupportedPlanningLocation(value: string) {
  return value.localeCompare(SUPPORTED_LOCATION, undefined, { sensitivity: "base" }) === 0;
}

function parseCatalogueCostRange(value: string) {
  const match = /^TTD \$([0-9]{1,3}(?:,[0-9]{3})*|[0-9]+)-\$([0-9]{1,3}(?:,[0-9]{3})*|[0-9]+)$/.exec(
    value,
  );
  if (!match) return null;

  const minimum = Number(match[1].replaceAll(",", ""));
  const maximum = Number(match[2].replaceAll(",", ""));
  if (!Number.isSafeInteger(minimum) || !Number.isSafeInteger(maximum) || minimum > maximum) {
    return null;
  }

  return { minimum, maximum };
}

function formatTtd(value: number) {
  return `TTD $${value.toLocaleString("en-US")}`;
}

function emptyPlan(
  reason: BuildPropertyMaintenancePlanResult["reason"],
  message: string,
  options: {
    location?: string;
    projectSummary?: string;
    priority?: MaintenancePlanPriority;
    invalidIds?: string[];
    duplicateIds?: string[];
  } = {},
): BuildPropertyMaintenancePlanResult {
  return {
    success: false,
    reason,
    message,
    plan_status: "not_created",
    location: options.location || SUPPORTED_LOCATION,
    supported_location: SUPPORTED_LOCATION,
    project_summary: options.projectSummary || null,
    priority: options.priority || "routine",
    services: [],
    unmatched_or_invalid_service_ids: options.invalidIds || [],
    duplicate_service_ids: options.duplicateIds || [],
    combined_estimated_range: null,
    combined_estimate_note:
      "No combined estimate was calculated. Catalogue ranges are indicative and non-binding, not a quote.",
    excluded_from_combined_estimate: [],
    assumptions: [
      "This planning tool does not assess property conditions, safety, urgency, or provider availability.",
      "No service has been booked and no provider has accepted this work.",
    ],
    next_steps: ["Review the service IDs and correct the planning input before creating a draft plan."],
  };
}

export function buildPropertyMaintenancePlan(input: unknown): BuildPropertyMaintenancePlanResult {
  const safeInput = isInputRecord(input) ? input : {};
  const location = textValue(safeInput.location) || SUPPORTED_LOCATION;
  const projectSummary = textValue(safeInput.project_summary).slice(0, 300);
  const priority = normalizePriority(safeInput.priority);
  const submittedIds = Array.isArray(safeInput.service_ids)
    ? safeInput.service_ids.map(textValue)
    : [];

  if (submittedIds.length === 0) {
    return emptyPlan(
      "service_ids_required",
      "Provide at least one exact service_id returned by find_maintenance_services.",
      { location, projectSummary, priority },
    );
  }

  if (submittedIds.length > BUILD_PROPERTY_MAINTENANCE_PLAN_MAX_SERVICES) {
    return emptyPlan(
      "too_many_services",
      `A draft plan supports at most ${BUILD_PROPERTY_MAINTENANCE_PLAN_MAX_SERVICES} service IDs.`,
      { location, projectSummary, priority },
    );
  }

  if (!isSupportedPlanningLocation(location)) {
    return emptyPlan(
      "unsupported_location",
      `AskJosh currently has public catalogue data only for ${SUPPORTED_LOCATION}.`,
      { location, projectSummary, priority },
    );
  }

  const uniqueIds: string[] = [];
  const duplicateIds: string[] = [];
  for (const serviceId of submittedIds) {
    if (uniqueIds.includes(serviceId)) {
      if (!duplicateIds.includes(serviceId)) duplicateIds.push(serviceId);
    } else {
      uniqueIds.push(serviceId);
    }
  }

  const providerByServiceId = new Map(providers.map((provider) => [serviceIdFor(provider), provider]));
  const invalidIds = uniqueIds.filter((serviceId) => !providerByServiceId.has(serviceId));
  const validProviders = uniqueIds
    .map((serviceId) => providerByServiceId.get(serviceId))
    .filter((provider): provider is (typeof providers)[number] => provider !== undefined)
    .sort((left, right) => {
      const leftRank = maintenanceSequence[left.category]?.rank ?? 999;
      const rightRank = maintenanceSequence[right.category]?.rank ?? 999;
      return leftRank - rightRank || left.category.localeCompare(right.category);
    });

  if (validProviders.length === 0) {
    return emptyPlan(
      "no_valid_service_ids",
      "None of the supplied service IDs matched the current public AskJosh catalogue.",
      { location, projectSummary, priority, invalidIds, duplicateIds },
    );
  }

  const services = validProviders.map((provider, index): PlannedMaintenanceService => ({
    ...toToolResult(provider),
    suggested_sequence: index + 1,
    planning_note:
      maintenanceSequence[provider.category]?.note ||
      "Review this catalogue service scope with the provider before arranging work.",
  }));

  let combinedMinimum = 0;
  let combinedMaximum = 0;
  const excludedFromEstimate: string[] = [];
  for (const provider of validProviders) {
    const range = parseCatalogueCostRange(provider.average_cost);
    if (!range) {
      excludedFromEstimate.push(serviceIdFor(provider));
      continue;
    }
    combinedMinimum += range.minimum;
    combinedMaximum += range.maximum;
  }

  const includedEstimateCount = validProviders.length - excludedFromEstimate.length;
  const combinedRange =
    includedEstimateCount > 0
      ? `${formatTtd(combinedMinimum)}-${formatTtd(combinedMaximum).replace("TTD ", "")}`
      : null;
  const hasInvalidIds = invalidIds.length > 0;

  return {
    success: !hasInvalidIds,
    reason: hasInvalidIds ? "partial_plan" : "plan_created",
    message: hasInvalidIds
      ? `A partial draft plan was created from ${services.length} valid service ID${services.length === 1 ? "" : "s"}; invalid IDs were not substituted.`
      : `A draft maintenance plan was created from ${services.length} grounded AskJosh service${services.length === 1 ? "" : "s"}.`,
    plan_status: hasInvalidIds ? "draft_with_invalid_service_ids" : "draft",
    location: SUPPORTED_LOCATION,
    supported_location: SUPPORTED_LOCATION,
    project_summary: projectSummary || null,
    priority,
    services,
    unmatched_or_invalid_service_ids: invalidIds,
    duplicate_service_ids: duplicateIds,
    combined_estimated_range: combinedRange,
    combined_estimate_note: combinedRange
      ? `Indicative, non-binding sum of ${includedEstimateCount} parseable public catalogue range${includedEstimateCount === 1 ? "" : "s"}; this is not a quote and excludes taxes, materials, emergency surcharges, travel costs, and other unlisted additions.`
      : "No catalogue ranges could be safely aggregated. Per-service estimates remain indicative and non-binding, not quotes.",
    excluded_from_combined_estimate: excludedFromEstimate,
    assumptions: [
      "Every planned item maps to an exact service ID in the current public AskJosh catalogue.",
      "The suggested sequence uses general deterministic category rules and is not engineering or safety advice.",
      "Project summary and priority are display context only; they do not establish property conditions, emergency status, completion dates, or provider availability.",
      "No service has been booked and no provider has accepted this work.",
    ],
    next_steps: [
      "Review the selected service scopes and suggested sequence.",
      "Confirm final scope, pricing, timing, and availability directly with the provider before arranging work.",
    ],
  };
}

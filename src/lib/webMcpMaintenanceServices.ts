import { providers, SUPPORTED_LOCATION } from "../data/providers.ts";
import { searchProviders, type SearchReason } from "./providerSearch.ts";

export const FIND_MAINTENANCE_SERVICES_TOOL_NAME = "find_maintenance_services";
export const FIND_MAINTENANCE_SERVICES_MAX_LIMIT = 5;
export const FIND_MAINTENANCE_SERVICES_DEFAULT_LIMIT = 3;

export interface FindMaintenanceServicesInput {
  query?: unknown;
  location?: unknown;
  limit?: unknown;
}

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
    service_id: `askjosh-service-${provider.id}`,
    provider_name: provider.name,
    category: provider.category,
    location: provider.location,
    summary: provider.description,
    typical_service: provider.average_service,
    estimated_cost_range: provider.average_cost,
    estimate_note: "Indicative range only. Final price and availability must be confirmed directly with the provider.",
  };
}

function messageFor(reason: FindMaintenanceServicesResult["reason"], count: number) {
  if (reason === "service_required") return "Enter a maintenance need to search the AskJosh catalogue.";
  if (reason === "unsupported_location") return `AskJosh currently has public catalogue data only for ${SUPPORTED_LOCATION}.`;
  if (reason === "no_matches") return `No matching service was found in the current ${SUPPORTED_LOCATION} catalogue.`;
  return `${count} matching service${count === 1 ? "" : "s"} found in the current ${SUPPORTED_LOCATION} catalogue.`;
}

function isInputRecord(value: unknown): value is FindMaintenanceServicesInput {
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

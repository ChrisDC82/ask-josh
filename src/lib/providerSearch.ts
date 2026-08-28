import type { Provider } from "@/data/providers";

export type SearchReason =
  | "matches_found"
  | "no_matches"
  | "service_required"
  | "unsupported_location";

export interface ProviderSearchResult {
  matches: Provider[];
  reason: SearchReason;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreProvider(provider: Provider, query: string) {
  const category = normalize(provider.category);
  const terms = [provider.category, ...provider.keywords].map(normalize);
  const queryTokens = new Set(query.split(" ").filter(Boolean));

  if (category === query) return 100;
  if (category.includes(query) || query.includes(category)) return 80;

  let score = 0;
  for (const term of terms) {
    if (term === query) score = Math.max(score, 75);
    else if (query.includes(term) || term.includes(query)) score = Math.max(score, 60);

    const termTokens = term.split(" ").filter(Boolean);
    const overlap = termTokens.filter((token) => queryTokens.has(token)).length;
    if (overlap > 0) score = Math.max(score, 30 + overlap * 5);
  }

  return score;
}

export function searchProviders(
  catalogue: Provider[],
  serviceQuery: string,
  locationQuery: string,
  supportedLocation: string,
): ProviderSearchResult {
  const query = normalize(serviceQuery);
  const requestedLocation = normalize(locationQuery);
  const supported = normalize(supportedLocation);

  if (!query) return { matches: [], reason: "service_required" };

  if (
    requestedLocation &&
    !supported.includes(requestedLocation) &&
    !requestedLocation.includes(supported)
  ) {
    return { matches: [], reason: "unsupported_location" };
  }

  const scored = catalogue
    .map((provider) => ({ provider, score: scoreProvider(provider, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.provider.category.localeCompare(b.provider.category));

  return {
    matches: scored.map((entry) => entry.provider),
    reason: scored.length > 0 ? "matches_found" : "no_matches",
  };
}

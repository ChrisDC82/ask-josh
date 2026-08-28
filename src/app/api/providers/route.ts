import { providers, SUPPORTED_LOCATION } from "@/data/providers";
import { searchProviders } from "@/lib/providerSearch";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const service = typeof body?.service === "string" ? body.service.trim() : "";
    const location = typeof body?.location === "string" ? body.location.trim() : "";

    if (!service) {
      return Response.json(
        { error: "Enter a maintenance service to search.", code: "SERVICE_REQUIRED" },
        { status: 400 },
      );
    }

    if (service.length > 100 || location.length > 100) {
      return Response.json(
        { error: "Search values must be 100 characters or fewer." },
        { status: 400 },
      );
    }

    const result = searchProviders(providers, service, location, SUPPORTED_LOCATION);

    return Response.json({
      providerFound: result.matches.length > 0,
      providers: result.matches.map((provider) => ({
        ...provider,
        matched_service: provider.category,
      })),
      reason: result.reason,
      supportedLocation: SUPPORTED_LOCATION,
    });
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
}

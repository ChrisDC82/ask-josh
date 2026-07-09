import { providers } from "@/data/providers";

export async function POST(req: Request) {
  const body = await req.json();
  const service = String(body.service || "").trim().toLowerCase();
  const location = String(body.location || "").trim().toLowerCase();

  const match = providers.find((provider) => {
    const serviceTerms = [
      provider.category,
      ...(provider.keywords || []),
    ].map((term) => term.toLowerCase());

    const serviceMatches = serviceTerms.some(
      (term) => service.includes(term) || term.includes(service),
    );
    const providerLocation = provider.location.toLowerCase();
    const locationMatches =
      !location ||
      providerLocation.includes(location) ||
      location.includes(providerLocation);

    return serviceMatches && locationMatches;
  });

  if (!match) {
    return Response.json({ providerFound: false });
  }

  return Response.json({
    providerFound: true,
    provider: {
      ...match,
      matched_service: match.category,
    },
  });
}

import { NextResponse } from "next/server";
import {
  providers,
  serviceCategories,
  SUPPORTED_LOCATION,
} from "@/data/providers";
import { searchProviders } from "@/lib/providerSearch";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = typeof body?.message === "string" ? body.message.trim() : "";

    if (!userMessage || userMessage.length > 400) {
      return NextResponse.json(
        { error: "Enter a message between 1 and 400 characters." },
        { status: 400 },
      );
    }

    const result = searchProviders(
      providers,
      userMessage,
      SUPPORTED_LOCATION,
      SUPPORTED_LOCATION,
    );

    if (result.matches.length > 0) {
      const categories = result.matches.map((provider) => provider.category).join(", ");
      return NextResponse.json({
        reply: `The current ${SUPPORTED_LOCATION} catalogue includes: ${categories}. Open Find a service on the homepage to review details and estimated cost ranges.`,
        matches: result.matches.map((provider) => ({
          id: provider.id,
          category: provider.category,
          average_cost: provider.average_cost,
        })),
        mode: "catalogue_guidance",
      });
    }

    return NextResponse.json({
      reply: `I could not match that to the current catalogue. Available services are ${serviceCategories.join(", ")}. Ask about one of these services in ${SUPPORTED_LOCATION}.`,
      matches: [],
      mode: "catalogue_guidance",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}

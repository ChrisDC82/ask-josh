import { NextResponse } from "next/server";

// Public request submission is intentionally disabled in Phase A. The current
// database schema cannot store a usable, contactable request without mixing
// private contact details into an unstructured message. The public UI prepares
// a user-reviewed email instead and never claims that AskJosh received it.
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Online request submission is not currently available. Use the provider contact options instead.",
    },
    { status: 503 },
  );
}







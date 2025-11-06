import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    // Validate that message exists
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Array of friendly mock replies from Josh
    const mockReplies = [
      "Hi there! I'm Josh — how can I help with your property today?",
      "I can connect you to our power washing or lawn care team!",
      "That sounds like something we can fix. Can you share your location?",
      "Thanks! I'll pass that to our maintenance staff.",
      "Got it! We'll follow up soon.",
    ];

    // Select a random reply from the array
    const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];

    // Return the random reply
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}


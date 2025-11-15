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
      "Hey there! I'm Josh, your community concierge. What are you looking for today?",
      "I can connect you with local creatives, caterers, or artisans near you.",
      "Would you like to explore cultural services or small business listings?",
      "Great choice! I'll show you who's available in your area.",
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


import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Validate that OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Call OpenAI API with GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are Josh, a friendly virtual assistant for a property maintenance company. Only answer questions about services like power washing, painting, tree cutting, lawn care, or maintenance scheduling.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Extract the AI-generated reply
    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // Return the AI-generated reply
    return NextResponse.json({
      reply: reply,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}


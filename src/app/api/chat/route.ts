import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
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
      console.error("OpenAI API key is not configured");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Call OpenAI API with GPT-4, fallback to GPT-3.5-turbo if unavailable
    let completion;
    try {
      completion = await openai.chat.completions.create({
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
    } catch (gpt4Error: any) {
      // If GPT-4 fails (e.g., not available), try GPT-3.5-turbo
      console.log("GPT-4 unavailable, falling back to GPT-3.5-turbo:", gpt4Error?.message);
      completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
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
    }

    // Extract the AI-generated reply
    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // Return the AI-generated reply
    return NextResponse.json({
      reply: reply,
    });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    // Log more details about the error
    if (error?.message) {
      console.error("Error message:", error.message);
    }
    if (error?.response) {
      console.error("Error response:", error.response);
    }

    // Return a more descriptive error message
    return NextResponse.json(
      { 
        error: "Failed to get AI response",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}


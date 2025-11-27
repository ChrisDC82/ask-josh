import { NextResponse } from "next/server";

let messageCount = 0;

export async function POST(req: Request) {
  const body = await req.json();
  const userMessage = body.message || "";

  messageCount++;

  let reply = "";
  
  if (messageCount === 1) {
    reply = "I would be happy to help you with that request.";
  } else if (messageCount === 2) {
    reply = "I will forward to my team and they will get back to you shortly with a quotation";
  } else {
    reply = "Thank you for your patience. Our team is working on your request.";
  }

  return NextResponse.json({
    reply,
    debug: "Mock mode active — not calling HuggingFace or any external API."
  });
}

"use client";

import { useState, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([
    { from: "josh", text: "Hi I'm Josh how can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { from: "josh", text: data.reply }
    ]);
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ask Josh</h2>

      <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-white">
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.from === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${
              m.from === "user" ? "bg-blue-200" : "bg-gray-200"
            }`}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

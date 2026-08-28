"use client";

import Link from "next/link";
import { useState } from "react";
import ChatBubble from "@/components/ChatBubble";

interface Message {
  from: "user" | "josh";
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "josh",
      text: "I can match your message to the maintenance services currently listed in La Brea. This is catalogue guidance, not live AI or a booking service.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage() {
    const userMessage = input.trim();
    if (!userMessage || loading) return;

    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Service guidance is unavailable.");

      setMessages((prev) => [...prev, { from: "josh", text: data.reply }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Service guidance is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto w-full max-w-2xl">
        <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to AskJosh
        </Link>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">AskJosh Service Guide</h1>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-yellow-900">
            Catalogue-based preview
          </span>
        </div>
        <p className="mt-3 text-slate-600">
          Describe a maintenance need and this guide will match it against the services currently listed for La Brea. It does not send requests or check live availability.
        </p>

        <section
          className="mt-6 h-96 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          aria-label="Service guidance conversation"
          aria-live="polite"
        >
          {messages.map((message, index) => (
            <ChatBubble key={`${message.from}-${index}`} message={message.text} sender={message.from} />
          ))}
          {loading && <p className="text-sm text-slate-500">Checking the catalogue…</p>}
        </section>

        <div className="mt-4">
          <label htmlFor="service-message" className="sr-only">
            Describe your maintenance need
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="service-message"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-3"
              placeholder="For example: I have a leaking pipe"
              value={input}
              maxLength={400}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void sendMessage();
              }}
            />
            <button
              onClick={() => void sendMessage()}
              disabled={loading || !input.trim()}
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Check services
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        </div>
      </div>
    </main>
  );
}

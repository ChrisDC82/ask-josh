"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ChatBubble from "@/components/ChatBubble";

interface Message {
  id: string;
  text: string;
  sender: "user" | "josh";
  timestamp: Date;
}

export default function ChatPage() {
  // State management for chat history
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi, I'm Josh! How can I help you today?",
      sender: "josh",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    const userMessageText = inputValue.trim();

    // Store user message in chat history
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };

    // Append user message to chat history
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Send message to API and get Josh's reply
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessageText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if API returned an error
      if (data.error) {
        throw new Error(data.error);
      }

      // Display the API reply as Josh's response
      const joshMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: "josh",
        timestamp: new Date(),
      };

      // Append Josh's reply to chat history
      setMessages((prev) => [...prev, joshMessage]);
    } catch (error) {
      // Handle error - show error message as Josh's reply
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again.",
        sender: "josh",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Navbar */}
      <nav className="w-full border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue">
              Ask Josh
            </Link>
          </div>
        </div>
      </nav>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <ChatBubble message={message.text} sender={message.sender} />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-0 sm:text-base"
            />
            <button
              onClick={handleSend}
              disabled={inputValue.trim() === ""}
              className="rounded-lg bg-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-blue/90 focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


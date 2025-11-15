"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!service || !message) {
      setError("Please select a service and provide a message.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name || null, service, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to submit request");
      }

      setStatus("success");
      setName("");
      setService("");
      setMessage("");
    } catch (err: any) {
      console.error("Failed to submit request", err);
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="w-full border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue">
                Ask Josh
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
          <div className="max-w-3xl space-y-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Your Community
              <span className="block text-blue"> Concierge.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
              Connecting you to trusted local businesses, creatives, and service providers.
            </p>
            <div className="flex justify-center">
              <Link
                href="/chat"
                className="rounded-lg bg-blue px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue/90 focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 sm:px-10 sm:py-5"
              >
                Chat with Josh
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Form */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
                Looking for a local creative, artisan, or service?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Tell Josh what you need and we'll connect you with local creatives, small businesses, and cultural service providers in your area.
              </p>
            </div>

            <div className="rounded-lg bg-white p-8 shadow">
              <h3 className="text-xl font-semibold text-gray-900">Request service</h3>
              <p className="mt-2 text-sm text-gray-500">
                Fill out the form below and we’ll follow up soon.
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name (optional)
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                    Service needed
                  </label>
                  <select
                    id="service"
                    value={service}
                    onChange={(event) => setService(event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue"
                    required
                  >
                    <option value="">Select service</option>
                    <option value="Power Washing">Power Washing</option>
                    <option value="Lawn Care">Lawn Care</option>
                    <option value="Tree Cutting">Tree Cutting</option>
                    <option value="Painting">Painting</option>
                    <option value="Maintenance Scheduling">Maintenance Scheduling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue"
                    placeholder="Tell Josh what you need"
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
                {status === "success" && (
                  <p className="text-sm text-green-600">Thanks! Josh will get back to you soon.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-md bg-blue px-4 py-2 font-semibold text-white transition hover:bg-blue/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? "Submitting..." : "Submit request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

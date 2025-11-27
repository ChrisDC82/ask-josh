// app/page.tsx

"use client";



import { useState } from "react";



export default function HomePage() {

  const [service, setService] = useState("AC repair and maintenance");

  const [location, setLocation] = useState("La Brea");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);



  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);

    setError(null);

    setResult(null);



    try {

      const res = await fetch("/api/providers", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ service, location }),

      });



      const data = await res.json();

      setResult(data);

    } catch (err) {

      setError("Network error");

    } finally {

      setLoading(false);

    }

  }



  return (

    <main className="min-h-screen flex items-center justify-center bg-white p-6">

      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">

        <h1 className="text-2xl font-bold mb-4">AskJosh</h1>



        <form onSubmit={handleSubmit} className="space-y-4">

          <label className="block">

            <span className="text-sm font-medium">Service</span>

            <input

              value={service}

              onChange={(e) => setService(e.target.value)}

              className="mt-1 block w-full rounded-md border px-3 py-2"

            />

          </label>



          <label className="block">

            <span className="text-sm font-medium">Location</span>

            <input

              value={location}

              onChange={(e) => setLocation(e.target.value)}

              className="mt-1 block w-full rounded-md border px-3 py-2"

            />

          </label>



          <div className="flex items-center gap-3">

            <button

              type="submit"

              className="px-4 py-2 rounded bg-blue-600 text-white"

              disabled={loading}

            >

              {loading ? "Searching…" : "Find Provider"}

            </button>

            <button

              type="button"

              onClick={() => {

                setService("AC repair and maintenance");

                setLocation("La Brea");

                setResult(null);

                setError(null);

              }}

              className="px-3 py-2 border rounded"

            >

              Reset

            </button>

          </div>

        </form>



        <div className="mt-6">

          {error && <p className="text-red-600">{error}</p>}

          {result && !result.providerFound && (

            <p>No providers matched your query.</p>

          )}



          {result && result.providerFound && (

            <div className="border rounded p-4">

              <h2 className="text-xl font-semibold">{result.provider.name}</h2>

              <p className="text-sm text-gray-600">{result.provider.location}</p>

              <p className="mt-2">{result.provider.description}</p>

              <ul className="mt-2 text-sm">

                <li><strong>Phone:</strong> {result.provider.phone}</li>

                <li><strong>Email:</strong> {result.provider.email}</li>

                <li><strong>Average Service:</strong> {result.provider.average_service}</li>

                <li><strong>Average Cost:</strong> {result.provider.average_cost}</li>

              </ul>

            </div>

          )}

        </div>

      </div>

    </main>

  );

}

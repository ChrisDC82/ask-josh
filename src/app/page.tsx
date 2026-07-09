"use client";



import { useRouter } from "next/navigation";

import { useState } from "react";



type ProviderResult = {
  providerFound: boolean;
  provider?: {
    name: string;
    matched_service: string;
    location: string;
    description: string;
    phone: string;
    email: string;
    average_service: string;
    average_cost: string;
    call_to_action: string;
  };
};



export default function Home() {

  const router = useRouter();



  // FORM STATES

  const [service, setService] = useState("AC repair and maintenance");

  const [location, setLocation] = useState("La Brea");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<ProviderResult | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [showSearchModal, setShowSearchModal] = useState(false);



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

    } catch {

      setError("Network error");

    } finally {

      setLoading(false);

    }

  }



  return (

    <main className="min-h-screen bg-white p-4 md:p-6">

      {/* HEADER */}
      <div className="flex justify-start mb-4 md:mb-8 px-4 md:px-0">
        <h2 className="text-2xl md:text-4xl font-bold text-blue-600">Ask Josh</h2>
      </div>

      {/* HERO SECTION */}

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-8 md:mb-16 px-4 md:px-0">

        <div className="md:mr-4 flex items-center gap-2 md:gap-4">

          <img

            src="/maintenance-josh.png"

            alt="Ask Josh Mascot"

            width={400}

            height={400}

            className="object-contain w-48 h-48 md:w-96 md:h-96"

          />

          <div className="flex flex-col items-center gap-4">

            <a

              href="https://instagram.com/askjoshtt"

              target="_blank"

              rel="noopener noreferrer"

              className="text-pink-600 hover:text-pink-700 transition-colors"

              aria-label="Follow us on Instagram"

            >

              <svg

                xmlns="http://www.w3.org/2000/svg"

                width="48"

                height="48"

                viewBox="0 0 24 24"

                fill="currentColor"

              >

                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>

              </svg>

            </a>



            {/* SERVICE ICONS - VERTICAL */}
            <div className="hidden md:flex flex-col gap-3">

              <div className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors cursor-pointer">

                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">

                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>

                </svg>

              </div>



              <div className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors cursor-pointer">

                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">

                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>

                  <circle cx="12" cy="10" r="3"/>

                </svg>

              </div>



              <div className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors cursor-pointer">

                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">

                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>

                  <line x1="16" y1="2" x2="16" y2="6"/>

                  <line x1="8" y1="2" x2="8" y2="6"/>

                  <line x1="3" y1="10" x2="21" y2="10"/>

                </svg>

              </div>



              <div className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors cursor-pointer">

                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">

                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>

                  <line x1="3" y1="6" x2="21" y2="6"/>

                  <path d="M16 10a4 4 0 0 1-8 0"/>

                </svg>

              </div>



              <div className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors cursor-pointer">

                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">

                  <path d="M3 2v7h18V2"/>

                  <line x1="3" y1="12" x2="21" y2="12"/>

                  <path d="M12 22l-3-3h6l-3 3z"/>

                </svg>

              </div>

            </div>

          </div>

        </div>



        <div className="max-w-xl px-4 md:px-0 text-center md:text-left">

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">

            Your Maintenance <span className="text-blue-600">Concierge.</span>

          </h1>



          <p className="text-gray-600 mt-4 text-base md:text-lg">

            Request quotes, schedule repairs, and connect with trusted maintenance professionals in minutes.

          </p>



          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8">

            <button

              onClick={() => router.push("/chat")}

              className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base"

              suppressHydrationWarning

            >

              Chat with Josh

            </button>



            <button

              onClick={() => setShowSearchModal(true)}

              className="bg-yellow-400 text-black px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base"

              suppressHydrationWarning

            >

              Request Maintenance Service

            </button>



            <button

              onClick={() => setShowSearchModal(true)}

              className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base"

              suppressHydrationWarning

            >

              Request a Quote

            </button>

          </div>

        </div>

      </div>



      {/* SEARCH MODAL */}
      {showSearchModal && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto mx-4">

            <div className="flex justify-between items-center p-6 border-b">

              <h2 className="text-2xl font-semibold">Request Maintenance Service</h2>

              <button

                onClick={() => {

                  setShowSearchModal(false);

                  setResult(null);

                  setError(null);

                }}

                className="text-gray-500 hover:text-gray-700 text-2xl"

                suppressHydrationWarning

              >

                ×

              </button>

            </div>



            <div className="p-6">

              <form onSubmit={handleSubmit} className="space-y-4">

                <div>

                  <label className="text-sm font-medium">Service</label>

                  <input

                    value={service}

                    onChange={(e) => setService(e.target.value)}

                    className="mt-1 block w-full rounded-md border px-3 py-2"

                    suppressHydrationWarning

                  />

                </div>



                <div>

                  <label className="text-sm font-medium">Location</label>

                  <input

                    value={location}

                    onChange={(e) => setLocation(e.target.value)}

                    className="mt-1 block w-full rounded-md border px-3 py-2"

                    suppressHydrationWarning

                  />

                </div>



                <button

                  type="submit"

                  className="px-4 py-2 bg-blue-600 text-white rounded"

                  disabled={loading}

                  suppressHydrationWarning

                >

                  {loading ? "Searching..." : "Request Quote"}

                </button>

              </form>



              {/* RESULTS */}

              <div className="mt-6">

                {error && <p className="text-red-600">{error}</p>}



                {result?.providerFound && result.provider && (

                  <div className="border rounded p-4 mt-4">

                    <p className="mb-3 text-sm font-medium text-blue-700">
                      Josh found a recommended maintenance partner for your request.
                    </p>

                    <h2 className="text-xl font-semibold">{result.provider.name}</h2>

                    <p className="font-medium text-blue-600">{result.provider.matched_service}</p>

                    <p className="text-gray-600">{result.provider.location}</p>

                    <p className="mt-2">{result.provider.description}</p>



                    <ul className="mt-2 text-sm">

                      <li><strong>Phone:</strong> {result.provider.phone}</li>

                      <li><strong>Email:</strong> {result.provider.email}</li>

                      <li><strong>Average Service:</strong> {result.provider.average_service}</li>

                      <li><strong>Estimated Cost Range:</strong> {result.provider.average_cost}</li>

                    </ul>

                    <a
                      href={`mailto:${result.provider.email}?subject=${encodeURIComponent(
                        `${result.provider.call_to_action}: ${result.provider.matched_service}`,
                      )}`}
                      className="inline-block mt-4 px-4 py-2 bg-yellow-400 text-black rounded"
                    >
                      {result.provider.call_to_action}
                    </a>

                  </div>

                )}



                {result && !result.providerFound && (

                  <p className="mt-2">
                    No maintenance service matched that request. Try AC repair, plumbing,
                    electrical repairs, painting, pressure washing, lawn care, tree cutting,
                    or general property maintenance.
                  </p>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </main>

  );

}

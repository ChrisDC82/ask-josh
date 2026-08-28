"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  providers as serviceCatalogue,
  SUPPORTED_LOCATION,
  type Provider,
} from "@/data/providers";

interface ProviderResult extends Provider {
  matched_service: string;
}

interface SearchResponse {
  error?: string;
  providers?: ProviderResult[];
  reason?: "matches_found" | "no_matches" | "unsupported_location";
  supportedLocation?: string;
}

const howItWorks = [
  { step: "1", title: "Describe the job", text: "Enter the maintenance service your property needs." },
  { step: "2", title: "Review a match", text: "See grounded service details and an indicative cost range from the current catalogue." },
  { step: "3", title: "Choose how to contact", text: "Call, email, or prepare a quote email that you review and send yourself." },
];

export default function Home() {
  const [service, setService] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProviderResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const serviceInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  function openSearch(prefill = "") {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setService(prefill);
    setResults([]);
    setError(null);
    setSearched(false);
    setShowSearchModal(true);
  }

  function closeSearch() {
    setShowSearchModal(false);
  }

  useEffect(() => {
    if (!showSearchModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => serviceInputRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeSearch();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [showSearchModal]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = service.trim();

    if (!query) {
      setError("Enter a maintenance service to search.");
      setResults([]);
      setSearched(false);
      serviceInputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setSearched(false);

    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: query, location: SUPPORTED_LOCATION }),
      });
      const data = (await response.json()) as SearchResponse;
      if (!response.ok) throw new Error(data.error || "Search is unavailable.");

      setResults(data.providers || []);
      setSearched(true);
      if (data.reason === "unsupported_location") {
        setError(`The current catalogue only covers ${data.supportedLocation || SUPPORTED_LOCATION}.`);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Search is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="text-2xl font-black tracking-tight text-blue-700">AskJosh</a>
          <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            <a href="#how-it-works" className="hover:text-blue-700">How it works</a>
            <a href="#services" className="hover:text-blue-700">Services</a>
            <a href="#coverage" className="hover:text-blue-700">Coverage</a>
            <Link href="/chat" className="hover:text-blue-700">Service guide</Link>
          </nav>
          <button type="button" onClick={() => openSearch()} className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800">
            Find a service
          </button>
        </div>
      </header>

      <section id="top" className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-[0.85fr_1.15fr] md:py-16 lg:px-8 lg:py-20">
          <div className="order-2 mx-auto max-w-[260px] md:max-w-sm">
            <Image src="/maintenance-josh.png" alt="Josh, the AskJosh maintenance guide" width={1024} height={1536} priority sizes="(max-width: 768px) 260px, 380px" className="h-auto w-full drop-shadow-xl" />
          </div>
          <div className="order-1">
            <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">Maintenance concierge · {SUPPORTED_LOCATION}</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Find a maintenance service for your property need.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Tell Josh what needs attention and review matching services from the current {SUPPORTED_LOCATION} catalogue, including indicative cost ranges and direct contact options.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => openSearch()} className="rounded-xl bg-blue-700 px-6 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-blue-800">Find a maintenance service</button>
              <a href="#services" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center text-base font-bold text-slate-800 transition hover:border-blue-300 hover:text-blue-800">Browse available services</a>
            </div>
            <p className="mt-4 text-sm text-slate-600">AskJosh currently presents services offered by Laughlin Maintenance Services. Availability and final prices must be confirmed directly.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">How AskJosh works</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">A clear path from need to contact</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {howItWorks.map((item) => (
            <article key={item.step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300 font-black text-slate-950">{item.step}</span>
              <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Services available</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Current maintenance categories</h2>
              <p className="mt-3 leading-7 text-slate-600">Select a category to search the catalogue. These are service offerings, not separate provider businesses.</p>
            </div>
            <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{serviceCatalogue.length} services · {SUPPORTED_LOCATION}</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCatalogue.map((provider) => (
              <button type="button" key={provider.id} onClick={() => openSearch(provider.category)} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-8 8l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 8-8z" /></svg>
                </span>
                <h3 className="mt-4 font-bold text-slate-950 group-hover:text-blue-800">{provider.category}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{provider.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="coverage" className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
        <article className="rounded-3xl bg-blue-800 p-7 text-white md:p-9">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-100">Current service area</p>
          <h2 className="mt-3 text-3xl font-black">{SUPPORTED_LOCATION}</h2>
          <p className="mt-4 leading-7 text-blue-50">AskJosh is starting with a focused catalogue for La Brea. The search does not claim coverage, providers, or availability outside this current scope.</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-7 md:p-9">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">What AskJosh helps with</p>
          <h2 className="mt-3 text-3xl font-black">Make the first step easier</h2>
          <ul className="mt-5 space-y-3 text-slate-700">
            <li>• Understand which listed service fits a property need.</li>
            <li>• Review an indicative cost range before making contact.</li>
            <li>• Reach the listed provider directly and confirm the details.</li>
          </ul>
        </article>
      </section>

      <section className="border-y border-yellow-200 bg-yellow-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-900">Future provider participation</p>
            <h2 className="mt-2 text-3xl font-black">Building carefully from a focused starting point</h2>
            <p className="mt-4 leading-7 text-slate-700">AskJosh currently presents one maintenance provider. A future phase can introduce a transparent participation and verification process for additional maintenance providers without changing the straightforward customer experience.</p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div><p className="text-xl font-black text-white">AskJosh</p><p className="mt-1 text-sm">A focused maintenance-service concierge for La Brea.</p></div>
          <div className="flex flex-wrap gap-5 text-sm font-semibold">
            <Link href="/chat" className="hover:text-white">Catalogue service guide</Link>
            <a href="https://instagram.com/askjoshtt" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            <a href="#top" className="hover:text-white">Back to top</a>
          </div>
        </div>
      </footer>

      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSearch(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="service-search-title" className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div><h2 id="service-search-title" className="text-2xl font-black">Find a maintenance service</h2><p className="mt-1 text-sm text-slate-600">Searching the current {SUPPORTED_LOCATION} catalogue.</p></div>
              <button type="button" onClick={closeSearch} className="rounded-lg p-2 text-2xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Close service search">×</button>
            </div>
            <div className="p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <div>
                  <label htmlFor="service" className="text-sm font-bold text-slate-800">Service needed</label>
                  <input ref={serviceInputRef} id="service" list="service-options" value={service} maxLength={100} onChange={(event) => setService(event.target.value)} placeholder="For example: plumbing" className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-3" aria-describedby="service-help" />
                  <datalist id="service-options">{serviceCatalogue.map((provider) => <option value={provider.category} key={provider.id} />)}</datalist>
                  <p id="service-help" className="mt-1.5 text-xs text-slate-500">Use a category or briefly describe the maintenance need.</p>
                </div>
                <div>
                  <label htmlFor="location" className="text-sm font-bold text-slate-800">Current area</label>
                  <input id="location" value={SUPPORTED_LOCATION} readOnly className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-slate-700" />
                </div>
                <button type="submit" disabled={loading} className="rounded-lg bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 sm:w-fit">{loading ? "Searching…" : "Search catalogue"}</button>
              </form>

              <div className="mt-6" aria-live="polite">
                {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p>}
                {results.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-blue-800">{results.length === 1 ? "One matching service" : `${results.length} matching services`} found in the current catalogue.</p>
                    {results.map((provider) => (
                      <article key={provider.id} className="rounded-xl border border-slate-200 p-5">
                        <p className="text-sm font-bold text-blue-700">{provider.matched_service}</p>
                        <h3 className="mt-1 text-xl font-black">{provider.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{provider.location}</p>
                        <p className="mt-3 leading-7 text-slate-700">{provider.description}</p>
                        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                          <div className="rounded-lg bg-slate-50 p-3"><dt className="font-bold text-slate-900">Typical service</dt><dd className="mt-1 text-slate-600">{provider.average_service}</dd></div>
                          <div className="rounded-lg bg-slate-50 p-3"><dt className="font-bold text-slate-900">Indicative range</dt><dd className="mt-1 text-slate-600">{provider.average_cost}</dd></div>
                        </dl>
                        <p className="mt-3 text-xs text-slate-500">Final price and availability must be confirmed directly with the provider.</p>
                        {!provider.contact_verified && <p className="mt-2 rounded-lg bg-yellow-50 p-2 text-xs font-medium text-yellow-900">Provider contact details are pending owner verification.</p>}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <a href={provider.phone_href} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">Call {provider.phone}</a>
                          <a href={`mailto:${provider.email}`} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 hover:border-blue-300">Email provider</a>
                          <Link href={`/providers?service=${encodeURIComponent(provider.category)}`} className="rounded-lg bg-yellow-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-400">Prepare quote email</Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                {searched && results.length === 0 && !error && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5"><h3 className="font-bold">No catalogue match found</h3><p className="mt-2 text-sm leading-6 text-slate-600">Try one of the service categories shown on the homepage. AskJosh will not invent a provider or claim coverage outside {SUPPORTED_LOCATION}.</p></div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

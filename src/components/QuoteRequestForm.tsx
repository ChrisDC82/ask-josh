"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  providerContact,
  serviceCategories,
  SUPPORTED_LOCATION,
} from "@/data/providers";

interface QuoteRequestFormProps {
  initialService: string;
}

export default function QuoteRequestForm({ initialService }: QuoteRequestFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(initialService);
  const [message, setMessage] = useState("");
  const [prepared, setPrepared] = useState(false);

  const mailtoHref = useMemo(() => {
    const subject = `Quote request: ${service}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Service area: ${SUPPORTED_LOCATION}`,
      `Service needed: ${service}`,
      "",
      "Request details:",
      message,
    ].join("\n");
    return `mailto:${providerContact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [email, message, name, phone, service]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrepared(true);
  }

  function update<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setPrepared(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline">← Back to AskJosh</Link>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">User-reviewed contact</p>
          <h1 className="mt-2 text-3xl font-black">Prepare a maintenance quote email</h1>
          <p className="mt-3 leading-7 text-slate-600">AskJosh does not send or store this request. Complete the details below, then review and send the draft from your own email app.</p>

          {!providerContact.contact_verified && <p className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm font-medium text-yellow-900">The provider email and phone number are pending owner verification.</p>}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="full-name" className="block text-sm font-bold text-slate-800">Full name</label>
              <input id="full-name" value={name} onChange={(event) => update(setName, event.target.value)} maxLength={100} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3" required />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-800">Email</label>
                <input id="email" type="email" value={email} onChange={(event) => update(setEmail, event.target.value)} maxLength={254} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-slate-800">Phone (optional)</label>
                <input id="phone" type="tel" value={phone} onChange={(event) => update(setPhone, event.target.value)} maxLength={30} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="maintenance-service" className="block text-sm font-bold text-slate-800">Maintenance service</label>
                <select id="maintenance-service" value={service} onChange={(event) => update(setService, event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-3" required>
                  {serviceCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="service-area" className="block text-sm font-bold text-slate-800">Current service area</label>
                <input id="service-area" value={SUPPORTED_LOCATION} readOnly className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-slate-700" />
              </div>
            </div>
            <div>
              <label htmlFor="request-details" className="block text-sm font-bold text-slate-800">What does the property need?</label>
              <textarea id="request-details" value={message} onChange={(event) => update(setMessage, event.target.value)} rows={5} minLength={10} maxLength={1000} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3" placeholder="Briefly describe the issue, relevant timing, and anything the provider should know." required />
              <p className="mt-1 text-xs text-slate-500">Do not include passwords, payment details, or other sensitive information.</p>
            </div>
            <button type="submit" className="w-full rounded-lg bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800">Prepare email draft</button>
          </form>

          {prepared && (
            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5" role="status">
              <h2 className="text-lg font-black text-blue-950">Draft ready — nothing has been sent</h2>
              <p className="mt-2 text-sm leading-6 text-blue-900">The next button opens your email app with the details above. Review the recipient and content, then choose whether to send it.</p>
              <a href={mailtoHref} className="mt-4 inline-flex rounded-lg bg-yellow-300 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-400">Open email draft</a>
            </div>
          )}

          <div className="mt-7 border-t border-slate-200 pt-5 text-sm text-slate-600">
            <p><strong className="text-slate-900">Listed provider:</strong> {providerContact.name}</p>
            <p className="mt-1"><a href={providerContact.phone_href} className="font-semibold text-blue-700 hover:underline">{providerContact.phone}</a> · <a href={`mailto:${providerContact.email}`} className="font-semibold text-blue-700 hover:underline">{providerContact.email}</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}

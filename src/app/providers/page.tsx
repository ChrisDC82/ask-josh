"use client";

import { useState } from "react";

export default function ProvidersPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Request a Maintenance Quote</h1>
      <p className="text-gray-600 mb-6">
        Tell Laughlin Maintenance Services what your property needs.
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input className="w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input className="w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block font-medium mb-1">Maintenance Service</label>
            <select className="w-full border rounded px-3 py-2" required>
              <option>AC Repair &amp; Maintenance</option>
              <option>Plumbing</option>
              <option>Electrical Repairs</option>
              <option>Painting</option>
              <option>Pressure Washing</option>
              <option>Lawn Care</option>
              <option>Tree Cutting</option>
              <option>General Property Maintenance</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-300 text-gray-900 py-2 rounded transition-colors hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          >
            Request Quote
          </button>
        </form>
      ) : (
        <div className="text-center bg-green-100 p-6 rounded">
          <h2 className="text-2xl font-semibold mb-3">Thank you!</h2>
          <p>Your quote request has been received. Our maintenance team will contact you soon.</p>
        </div>
      )}
    </div>
  );
}

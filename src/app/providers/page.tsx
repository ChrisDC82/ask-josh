"use client";

import { useState } from "react";

export default function ProvidersPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Service Provider Sign-Up</h1>

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
            <label className="block font-medium mb-1">Service Category</label>
            <select className="w-full border rounded px-3 py-2" required>
              <option>Event Planner</option>
              <option>Decorator</option>
              <option>Caterer</option>
              <option>Videographer</option>
              <option>Photographer</option>
              <option>Artist / Creative</option>
              <option>Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-300 text-gray-900 py-2 rounded transition-colors hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          >
            Submit
          </button>

        </form>
      ) : (
        <div className="text-center bg-green-100 p-6 rounded">
          <h2 className="text-2xl font-semibold mb-3">Thank you!</h2>
          <p>Your application has been received. We will contact you soon.</p>
        </div>
      )}
    </div>
  );
}


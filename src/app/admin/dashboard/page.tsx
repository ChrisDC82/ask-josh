"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RequestRecord {
  id: string;
  name: string | null;
  service: string | null;
  message: string | null;
  timestamp: string | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminSession");
    if (!token) {
      router.replace("/admin");
      return;
    }
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/requests");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch requests");
      }

      setRequests(data.requests || []);
    } catch (err: any) {
      console.error("Failed to load requests", err);
      setError(err.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDone = async (id: string) => {
    setActionId(id);
    setError(null);

    try {
      const response = await fetch("/api/admin/requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update request");
      }

      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (err: any) {
      console.error("Failed to mark request as done", err);
      setError(err.message || "Unable to mark request as done");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Review incoming service requests and mark them as done when completed.
            </p>
          </div>
          <button
            onClick={fetchRequests}
            className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue/90"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</div>}

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                    Loading requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                    No requests yet.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {request.name || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {request.service || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {request.message || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {request.timestamp
                        ? new Date(request.timestamp).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-4 text-right text-sm">
                      <button
                        onClick={() => handleMarkAsDone(request.id)}
                        disabled={actionId === request.id}
                        className="rounded-md bg-green-600 px-3 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {actionId === request.id ? "Marking..." : "Mark as done"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  approveTechnicianApplication,
  getPendingTechnicianApplications,
  rejectTechnicianApplication,
  type TechnicianApplication,
} from "../api/technician.api";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "The request failed. Please try again.";
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}

function AdminTechnicianRoleApprovalsPage() {
  const [requests, setRequests] = useState<TechnicianApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      setRequests(await getPendingTechnicianApplications());
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const decide = async (userId: string, action: "approve" | "reject") => {
    const confirmed = window.confirm(
      action === "approve"
        ? "Approve this user's free Technician application?"
        : "Reject this Technician application?"
    );
    if (!confirmed) return;

    setProcessingId(userId);
    setError("");
    setMessage("");
    try {
      if (action === "approve") {
        await approveTechnicianApplication(userId);
        setMessage("Technician role approved. The user must sign in again and complete their profile.");
      } else {
        await rejectTechnicianApplication(userId);
        setMessage("Technician application rejected.");
      }
      await loadRequests();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Technician Applications</h1>
          <p className="mt-1 text-sm text-gray-600">Review free Technician role applications submitted by tenants.</p>
        </div>
        <button type="button" onClick={() => void loadRequests()} disabled={loading || processingId !== null} className="rounded-lg border px-4 py-2">
          Refresh
        </button>
      </header>

      {message && <p role="status" className="rounded-lg bg-green-50 p-3 text-green-800">{message}</p>}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

      {loading ? <p>Loading applications...</p> : requests.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <h2 className="font-semibold">No pending Technician applications</h2>
          <p className="mt-1 text-sm text-gray-600">New applications will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Applicant</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Applied</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-t">
                  <td className="p-3 font-medium">{request.name}</td>
                  <td className="p-3">{request.email}</td>
                  <td className="p-3">{request.phone || "—"}</td>
                  <td className="p-3">{request.technicianApplicationRequestedAt ? new Date(request.technicianApplicationRequestedAt).toLocaleString() : "—"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => void decide(request._id, "approve")} disabled={processingId !== null} className="rounded-md bg-blue-600 px-3 py-1.5 text-white disabled:opacity-50">
                        {processingId === request._id ? "Processing..." : "Approve"}
                      </button>
                      <button type="button" onClick={() => void decide(request._id, "reject")} disabled={processingId !== null} className="rounded-md border px-3 py-1.5 disabled:opacity-50">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminTechnicianRoleApprovalsPage;

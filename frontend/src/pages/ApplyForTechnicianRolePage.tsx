import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  applyForTechnicianRole,
  getTechnicianApplicationStatus,
  type TechnicianApplicationStatus,
} from "../api/technician.api";

function ApplyForTechnicianRolePage() {
  const [status, setStatus] = useState<TechnicianApplicationStatus>("NOT_REQUESTED");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadStatus = useCallback(async () => {
    try {
      const result = await getTechnicianApplicationStatus();
      setStatus(result.status);
      setError("");
    } catch {
      setError("Could not load your application status. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const handleApply = async () => {
    setSubmitting(true);
    setError("");
    try {
      await applyForTechnicianRole();
      setStatus("PENDING");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      setError(message || "Unable to submit your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-container"><p>Loading application status...</p></div>;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Career role application</p>
        <h1 className="mt-2 text-2xl font-bold">Apply for Technician Role</h1>
        <p className="mt-3 text-gray-600">
          Apply to become a property maintenance Technician. This application is free.
          An Admin must review and approve it before your account changes role.
        </p>

        <div className="my-6 rounded-xl bg-gray-50 p-5">
          <p className="text-sm text-gray-500">Application fee</p>
          <p className="mt-1 text-3xl font-bold">Free</p>
          <p className="mt-2 text-sm text-gray-600">
            After approval, sign in again and complete your skills, experience,
            service areas, availability and working hours. You cannot receive
            assignments until your profile is complete.
          </p>
        </div>

        {status === "PENDING" && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900" role="status">
            <h2 className="font-semibold">Application under review</h2>
            <p className="mt-1 text-sm">Your application has been submitted and is waiting for Admin approval.</p>
          </div>
        )}
        {status === "APPROVED" && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900" role="status">
            <h2 className="font-semibold">Application approved</h2>
            <p className="mt-1 text-sm">Your role has been changed to Technician. Sign out and sign in again to refresh your access, then complete your Technician profile.</p>
          </div>
        )}
        {status === "REJECTED" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900" role="status">
            <h2 className="font-semibold">Application not approved</h2>
            <p className="mt-1 text-sm">You may review your details and submit a new application.</p>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}

        {(status === "NOT_REQUESTED" || status === "REJECTED") && (
          <button
            type="button"
            onClick={() => void handleApply()}
            disabled={submitting}
            className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting application..." : status === "REJECTED" ? "Reapply for Technician Role" : "Apply for Technician Role — Free"}
          </button>
        )}
      </section>
    </main>
  );
}

export default ApplyForTechnicianRolePage;

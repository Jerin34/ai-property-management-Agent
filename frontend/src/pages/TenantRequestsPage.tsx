import { useEffect, useState } from "react";
import { getManagerPropertyRequests, reviewPropertyRequest, type PropertyStayRequest } from "../api/property.api";

function TenantRequestsPage() {
  const [requests, setRequests] = useState<PropertyStayRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await getManagerPropertyRequests();
      setRequests(data);
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Unable to load tenant requests.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const review = async (id: string, decision: "APPROVE" | "REJECT") => {
    try {
      setBusyId(id);
      setError("");
      await reviewPropertyRequest(id, decision);
      await load();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Unable to review this request.");
    } finally {
      setBusyId("");
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading tenant requests...</p></div>;
  return (
    <div>
      <div className="page-header"><div className="page-header-left"><h1 className="page-header-title">Tenant Requests</h1><p className="page-header-subtitle">Review requests from tenants who want to stay in your properties.</p></div></div>
      {error && <div className="alert-error" role="alert">{error}</div>}
      {requests.length === 0 ? <div className="empty-state"><h3>No pending tenant requests</h3><p>New requests will appear here.</p></div> : (
        <div className="grid-cards">
          {requests.map((request) => (
            <div className="card" key={request._id}>
              <span className="badge badge-warning">Pending approval</span>
              <h3>{typeof request.property === "string" ? "Property" : request.property.name}</h3>
              <p><strong>Tenant:</strong> {typeof request.tenant === "string" ? request.tenant : request.tenant.name}</p>
              {typeof request.tenant !== "string" && <p>{request.tenant.email}</p>}
              {typeof request.property !== "string" && <p>{request.property.address?.street}, {request.property.address?.city}</p>}
              <p className="page-header-subtitle">Requested on {new Date(request.createdAt).toLocaleString()}</p>
              <div style={{ display: "flex", gap: ".75rem" }}>
                <button className="btn btn-primary" disabled={!!busyId} onClick={() => void review(request._id, "APPROVE")}>{busyId === request._id ? "Processing..." : "Accept Tenant"}</button>
                <button className="btn btn-secondary" disabled={!!busyId} onClick={() => void review(request._id, "REJECT")}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default TenantRequestsPage;

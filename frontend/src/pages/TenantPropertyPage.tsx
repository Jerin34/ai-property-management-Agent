import { useEffect, useState } from "react";
import {
  browseProperties,
  getMyPropertyRequests,
  requestToStay,
  getMyTenantAssignments,
  type TenantPropertyAssignment,
  type BrowseProperty,
  type PropertyStayRequest,
} from "../api/property.api";

function TenantPropertyPage() {
  const [properties, setProperties] = useState<BrowseProperty[]>([]);
  const [requests, setRequests] = useState<PropertyStayRequest[]>([]);
  const [assignments, setAssignments] = useState<TenantPropertyAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [propertyData, requestData, assignmentData] = await Promise.all([
        browseProperties(),
        getMyPropertyRequests(),
        getMyTenantAssignments(),
      ]);
      setProperties(propertyData);
      setRequests(requestData);
      setAssignments(assignmentData.filter((assignment) => assignment.status === "ACTIVE"));
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Unable to load property information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const handleRequest = async (propertyId: string) => {
    try {
      setBusyId(propertyId);
      setError("");
      await requestToStay(propertyId);
      await load();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Unable to send your request.");
    } finally {
      setBusyId("");
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading your property...</p></div>;

  const activeRequest = requests.find((r) => r.status === "PENDING");
  const assignedProperties = assignments.map((assignment) => assignment.property).filter((property): property is Exclude<TenantPropertyAssignment["property"], string> => typeof property !== "string");

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Your Property</h1>
          <p className="page-header-subtitle">Request to stay at a property and wait for its manager's approval.</p>
        </div>
      </div>
      {error && <div className="alert-error" role="alert">{error}</div>}
      {assignedProperties.length > 0 ? (
        <div className="card">
          <span className="badge badge-completed">Approved · Your assigned property</span>
          {assignedProperties.map((property) => <div key={property._id}><h2>{property.name}</h2><p>{property.address?.street}, {property.address?.city}</p></div>)}
          <p className="page-header-subtitle">Your manager approved your stay. You can now submit maintenance requests for this property.</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <h3>{activeRequest ? "Your request is waiting for manager approval" : "You don't have an assigned property yet"}</h3>
            <p className="page-header-subtitle">{activeRequest ? "You can track your request below. The property will appear here after approval." : "Browse properties below and send a request to the property manager."}</p>
            {activeRequest && <span className="badge badge-warning">Request pending</span>}
          </div>
          <h2>Available Properties</h2>
          <div className="grid-cards">
            {properties.map((property) => {
              const existing = requests.find((r) => (typeof r.property === "string" ? r.property : r.property._id) === property._id);
              return (
                <div className="card" key={property._id}>
                  <h3>{property.name}</h3>
                  <p>{property.address.street}, {property.address.city}</p>
                  {property.description && <p>{property.description}</p>}
                  {existing ? (
                    <span className={existing.status === "APPROVED" ? "badge badge-completed" : existing.status === "REJECTED" ? "badge badge-neutral" : "badge badge-warning"}>
                      {existing.status}
                    </span>
                  ) : (
                    <button className="btn btn-primary" disabled={!!activeRequest || assignments.length > 0 || !!busyId} onClick={() => void handleRequest(property._id)}>
                      {busyId === property._id ? "Sending..." : "Request to Stay"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {properties.length === 0 && <div className="empty-state"><h3>No active properties available</h3><p>Please contact a property manager.</p></div>}
        </>
      )}
      {requests.some((r) => r.status === "REJECTED") && (
        <section style={{ marginTop: "1.5rem" }}>
          <h2>Previous Requests</h2>
          {requests.filter((r) => r.status === "REJECTED").map((r) => (
            <p key={r._id}>{typeof r.property === "string" ? "Property" : r.property.name} — <span className="badge badge-neutral">Rejected</span></p>
          ))}
        </section>
      )}
    </div>
  );
}
export default TenantPropertyPage;

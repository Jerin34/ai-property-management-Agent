import { useEffect, useState } from "react";
import { getTechnicianMaintenanceRequests } from "../api/maintenance.api";
import { useNavigate } from "react-router-dom";
import type { Maintenance } from "../types/maintenance.types";

function TechnicianMaintenancePage() {
  const navigate = useNavigate();
  const [maintenanceRequest, setGetMaintenanceRequests] = useState<Maintenance[]>([]);
  const [isloading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTechnicianMaintenanceRequests();
        setGetMaintenanceRequests(data);
      } catch {
        setError("Error loading maintenance requests");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaintenance();
  }, []);

  if (isloading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your assigned maintenance jobs...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "EMERGENCY":
        return "badge-emergency";
      case "HIGH":
        return "badge-high";
      case "MEDIUM":
        return "badge-medium";
      default:
        return "badge-low";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "OPEN":
        return "badge-open";
      case "IN_PROGRESS":
        return "badge-in-progress";
      case "COMPLETED":
        return "badge-completed";
      default:
        return "badge-neutral";
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">My Maintenance Assignments</h1>
          <p className="page-header-subtitle">
            Manage your assigned dispatch tickets, update progress statuses, and submit repair costs.
          </p>
        </div>
        <div className="page-header-actions">
          <span className="badge badge-neutral" style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}>
            Assigned: {maintenanceRequest.length}
          </span>
        </div>
      </div>

      {maintenanceRequest.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🛠️</span>
          <h3>No Maintenance Requests Assigned</h3>
          <p>You have no pending maintenance orders assigned to your profile at this moment.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {maintenanceRequest.map((maintenance) => (
            <div key={maintenance._id} className="card card-interactive">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {maintenance.title}
                  </h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Category: <strong>{maintenance.category}</strong>
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span className={`badge ${getPriorityBadgeClass(maintenance.priority)}`}>
                    {maintenance.priority}
                  </span>
                  <span className={`badge ${getStatusBadgeClass(maintenance.status)}`}>
                    {maintenance.status}
                  </span>
                </div>
              </div>

              {maintenance.description && (
                <p style={{ color: "var(--text-body)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                  {maintenance.description}
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/maintenance/${maintenance._id}`)}
                >
                  Manage Job & Update →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TechnicianMaintenancePage;
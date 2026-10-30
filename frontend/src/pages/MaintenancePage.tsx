import { useState, useEffect } from "react";
import { getMaintenanceRequests } from "../api/maintenance.api";
import type { Maintenance } from "../types/maintenance.types";
import { useNavigate } from "react-router-dom";
import MaintenanceCard from "../components/MaintenanceCards";
import { useAuth } from "../context/Authcontext";

function MaintenancePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMaintenanceRequests();
        setMaintenance(data);
      } catch {
        setError("Error loading maintenance requests");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaintenance();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading maintenance work orders...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Maintenance Work Orders</h1>
          <p className="page-header-subtitle">
            Track, prioritize, and manage repair requests across all properties.
          </p>
        </div>
        <div className="page-header-actions">
          <span className="badge badge-neutral" style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}>
            Total Requests: {maintenance.length}
          </span>
          {user?.role === "TENANT" && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/maintenance/create")}
            >
              + Create Maintenance Request
            </button>
          )}
        </div>
      </div>

      {maintenance.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🔧</span>
          <h3>No Maintenance Requests</h3>
          <p>There are no active or historical maintenance requests recorded.</p>
          {user?.role === "TENANT" && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: "1rem" }}
              onClick={() => navigate("/maintenance/create")}
            >
              Submit Your First Request
            </button>
          )}
        </div>
      ) : (
        <div>
          {maintenance.map((item) => (
            <MaintenanceCard key={item._id} maintenance={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MaintenancePage;
import { useNavigate } from "react-router-dom";
import type { Maintenance } from "../types/maintenance.types";

interface MaintenanceCardProps {
  maintenance: Maintenance;
}

function MaintenanceCards({ maintenance }: MaintenanceCardProps) {
  const navigate = useNavigate();

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
    <div className="card card-interactive" style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <div>
          <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)" }}>
            {maintenance.title}
          </h3>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
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

      <p
        style={{
          color: "var(--text-body)",
          fontSize: "0.9rem",
          margin: "0.5rem 0 1rem 0",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {maintenance.description}
      </p>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/maintenance/${maintenance._id}`)}
        >
          View Details →
        </button>
      </div>
    </div>
  );
}

export default MaintenanceCards;
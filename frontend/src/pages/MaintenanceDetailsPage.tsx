import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getMaintenanceById,
  getTechnicianRecommendation,
  assignTechnician,
  getRecurringMaintenance,
  updateMaintenanceStatus,
  getMaintenanceUpdates,
  predictMaintenanceCost,
} from "../api/maintenance.api";
import type { Maintenance, MaintenanceUpdates } from "../types/maintenance.types";
import type { TechnicianRecommendation } from "../types/technician.types";
import TechnicianRecommendations from "../components/TechnicianRecommendation";
import MaintenancesUpdates from "../components/MaintenanceUpdates";
import AddMaintenanceUpdate from "../components/AddMaintenanceUpdates";
import { useAuth } from "../context/useAuth";
import type { RecurringMaintenance as RecurringMaintenanceData } from "../types/recurring-maintenance.types";
import RecurringMaintenance from "../components/RecurringMaintenaceCard";
import MaintenanceCostForm from "../components/MaintenanceCostForm";

function MaintenanceDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<TechnicianRecommendation[]>([]);
  const [updates, setUpdates] = useState<MaintenanceUpdates[]>([]);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [recurringData, setRecurringData] = useState<RecurringMaintenanceData | null>(null);
  const [isRecurringLoading, setIsRecurringLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isPredictingCost, setIsPredictingCost] = useState(false);
  const [costPrediction, setCostPrediction] = useState<{
    predictedCost: number;
    confidence: "LOW" | "MEDIUM" | "HIGH";
    reason: string;
  } | null>(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      if (!id) {
        setError("Maintenance request ID is missing.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMaintenanceById(id);
        setMaintenance(data);
        const updatesData = await getMaintenanceUpdates(id);
        setUpdates(updatesData);

        if (user?.role === "MANAGER") {
          try {
            setIsRecurringLoading(true);
            const recurring = await getRecurringMaintenance(id);
            setRecurringData(recurring);
          } catch (error) {
            console.error("Failed to load recurring maintenance:", error);
          } finally {
            setIsRecurringLoading(false);
          }
        }

        if (user?.role === "MANAGER") {
          try {
            setIsRecommendationLoading(true);
            const recommendationData = await getTechnicianRecommendation(id);
            setRecommendations(recommendationData);
          } catch (err) {
            console.log("Error loading technician recommendation", err);
          } finally {
            setIsRecommendationLoading(false);
          }
        }
      } catch (err) {
        console.log("Error loading maintenance requests", err);
        setError("Failed to load maintenance requests");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaintenance();
  }, [id, user]);

  const handlePredictCost = async () => {
    if (!maintenance) return;

    try {
      setIsPredictingCost(true);
      const prediction = await predictMaintenanceCost(maintenance._id);
      setCostPrediction(prediction);

      const updatedMaintenance = await getMaintenanceById(maintenance._id);
      setMaintenance(updatedMaintenance);
    } catch (err) {
      console.log("Failed to predict maintenance cost", err);
    } finally {
      setIsPredictingCost(false);
    }
  };

  const handleStatusUpdate = async (status: "IN_PROGRESS" | "COMPLETED") => {
    if (!maintenance) return;

    try {
      setIsUpdatingStatus(true);
      const updatedMaintenance = await updateMaintenanceStatus(maintenance._id, {
        status,
      });
      setMaintenance(updatedMaintenance);
    } catch (err) {
      console.log("Failed to update maintenance status", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading maintenance order details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  if (!maintenance) {
    return (
      <div className="empty-state">
        <h3>Maintenance Request Not Found</h3>
        <p>The requested work order could not be loaded.</p>
      </div>
    );
  }

  const isAssignedTechnician =
    user?.role === "TECHNICIAN" &&
    maintenance.technician &&
    typeof maintenance.technician !== "string" &&
    maintenance.technician._id === user.id;

  const getPriorityBadge = (priority: string) => {
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

  const getStatusBadge = (status: string) => {
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
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <h1 className="page-header-title" style={{ margin: 0 }}>{maintenance.title}</h1>
            <span className={`badge ${getStatusBadge(maintenance.status)}`}>{maintenance.status}</span>
            <span className={`badge ${getPriorityBadge(maintenance.priority)}`}>{maintenance.priority}</span>
          </div>
          <p className="page-header-subtitle">Work Order ID: {maintenance._id}</p>
        </div>

        {/* Technician Workflow Action Controls */}
        {user?.role === "TECHNICIAN" && (
          <div className="page-header-actions">
            {maintenance.status === "OPEN" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleStatusUpdate("IN_PROGRESS")}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Updating..." : "▶ Start Work"}
              </button>
            )}

            {maintenance.status === "IN_PROGRESS" && (
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleStatusUpdate("COMPLETED")}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Updating..." : "✓ Complete Work"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid-2">
        {/* Left Column: Details, Description, AI Summary, Parties & Costs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Overview & Description Card */}
          <div className="card">
            <h3 className="card-title">Problem Description</h3>
            <p style={{ color: "var(--text-body)", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1.25rem 0" }}>
              {maintenance.description}
            </p>

            <div style={{ background: "var(--ai-light)", border: "1px solid var(--ai-border)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
                <span className="badge badge-ai">✨ AI Synthesis</span>
                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--ai-primary)" }}>Summary</span>
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-main)", lineHeight: 1.5 }}>
                {maintenance.aiSummary === null ? "No AI summary available." : maintenance.aiSummary}
              </p>
            </div>
            
          {/* Maintenance Photos Card */}
          <div className="card">
            <h3 className="card-title">Maintenance Photos</h3>

            {maintenance.photos && maintenance.photos.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "1rem",
                }}
              >
                {maintenance.photos.map((photoUrl, index) => (
                  <a
                    key={`${photoUrl}-${index}`}
                    href={photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                    }}
                    aria-label={`Open maintenance photo ${index + 1} in a new tab`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Maintenance issue photo ${index + 1}`}
                      loading="lazy"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", margin: 0 }}>
                No photos have been attached to this maintenance request.
              </p>
            )}
          </div>

          </div>

          {/* Request Information Meta Card */}
          <div className="card">
            <h3 className="card-title">Order Metadata & Contacts</h3>
            <div className="detail-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value">{maintenance.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Escalation Level</span>
                <span className="meta-value">{maintenance.esclationLevel ?? "NONE"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Property</span>
                <span className="meta-value">
                  {typeof maintenance.property === "string"
                    ? maintenance.property
                    : maintenance.property.name ?? maintenance.property._id}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Tenant</span>
                <span className="meta-value">
                  {typeof maintenance.tenant === "string"
                    ? maintenance.tenant
                    : maintenance.tenant.name ?? maintenance.tenant._id}
                </span>
                {typeof maintenance.tenant !== "string" && maintenance.tenant?.email && (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {maintenance.tenant.email}
                  </span>
                )}
              </div>
            </div>

            <div style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
              <span className="meta-label">Assigned Technician</span>
              {!maintenance.technician ? (
                <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  No technician assigned yet.
                </p>
              ) : typeof maintenance.technician === "string" ? (
                <p style={{ margin: "0.25rem 0 0 0", fontWeight: 600 }}>{maintenance.technician}</p>
              ) : (
                <div style={{ marginTop: "0.25rem" }}>
                  <p style={{ margin: 0, fontWeight: 600, color: "var(--text-main)" }}>
                    {maintenance.technician.name ?? maintenance.technician._id}
                  </p>
                  {maintenance.technician.email && (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {maintenance.technician.email}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="card">
            <h3 className="card-title">Cost Accounting</h3>
            <div className="detail-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Estimated Cost</span>
                <span className="meta-value" style={{ color: "var(--primary)" }}>
                  {maintenance.estimatedCost !== undefined && maintenance.estimatedCost !== null
                    ? `$${maintenance.estimatedCost}`
                    : "Not available"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Actual Cost</span>
                <span className="meta-value" style={{ color: "var(--status-low-text)" }}>
                  {maintenance.actualCost !== undefined && maintenance.actualCost !== null
                    ? `$${maintenance.actualCost}`
                    : "Not available"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Labor Cost</span>
                <span className="meta-value">
                  {maintenance.laborCost !== undefined && maintenance.laborCost !== null
                    ? `$${maintenance.laborCost}`
                    : "Not available"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Material Cost</span>
                <span className="meta-value">
                  {maintenance.materialCost !== undefined && maintenance.materialCost !== null
                    ? `$${maintenance.materialCost}`
                    : "Not available"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-muted)", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
              <span>Created: <strong>{new Date(maintenance.createdAt).toLocaleString()}</strong></span>
              <span>Updated: <strong>{new Date(maintenance.updatedAt).toLocaleString()}</strong></span>
              {maintenance.escaltedAt && (
                <span>Escalated: <strong>{new Date(maintenance.escaltedAt).toLocaleString()}</strong></span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Actions, Intelligence & Feeds */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* AI Cost Predictor Widget (Manager Only) */}
          {user?.role === "MANAGER" && (
            <div className="card card-ai">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className="badge badge-ai">AI Cost Engine</span>
                  <h4 style={{ margin: 0 }}>Predictive Repair Cost</h4>
                </div>
                <button
                  type="button"
                  className="btn btn-ai btn-sm"
                  onClick={handlePredictCost}
                  disabled={isPredictingCost}
                >
                  {isPredictingCost ? "Predicting..." : "⚡ Predict Cost with AI"}
                </button>
              </div>

              {costPrediction ? (
                <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", marginTop: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                      Predicted Estimate
                    </span>
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--ai-primary)" }}>
                      ${costPrediction.predictedCost}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Confidence:</span>
                    <span className={`badge ${costPrediction.confidence === "HIGH" ? "badge-completed" : costPrediction.confidence === "MEDIUM" ? "badge-high" : "badge-emergency"}`}>
                      {costPrediction.confidence}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-body)" }}>
                    <strong>Rationale:</strong> {costPrediction.reason}
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                  Current Estimated Cost: <strong>{maintenance.estimatedCost ?? "Not calculated"}</strong>. Click above to run ML cost prediction.
                </p>
              )}
            </div>
          )}

          {/* AI Technician Recommendations (Manager Only) */}
          {user?.role === "MANAGER" && (
            <TechnicianRecommendations
              recommendations={recommendations}
              isLoading={isRecommendationLoading}
              isAssigning={isAssigning}
              onSelect={async (technicianId) => {
                if (!id) return;
                try {
                  setIsAssigning(true);
                  const updatedMaintenance = await assignTechnician(id, { technicianId });
                  setMaintenance(updatedMaintenance);
                } catch (err) {
                  console.log("Technician Assignment error", err);
                } finally {
                  setIsAssigning(false);
                }
              }}
            />
          )}

          {/* Recurring Maintenance Detection (Manager Only) */}
          {user?.role === "MANAGER" && (
            <RecurringMaintenance data={recurringData} isLoading={isRecurringLoading} />
          )}

          {/* Activity Timeline Feed */}
          <MaintenancesUpdates updates={updates} />

          {/* Add Update Form (Assigned Technician Only) */}
          {isAssignedTechnician && (
            <AddMaintenanceUpdate
              maintenanceId={maintenance._id}
              onUpdateCreated={async () => {
                const updatedData = await getMaintenanceUpdates(maintenance._id);
                setUpdates(updatedData);
              }}
            />
          )}

          {/* Log Actual Costs Form (Assigned Technician Only) */}
          {isAssignedTechnician && (
            <MaintenanceCostForm
              maintenanceId={maintenance._id}
              onCostUpdate={async () => {
                const updatedMaintenance = await getMaintenanceById(maintenance._id);
                setMaintenance(updatedMaintenance);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MaintenanceDetailsPage;

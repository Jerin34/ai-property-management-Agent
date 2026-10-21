import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPropertyById,
  getPropertiesHealth,
  getPropertyCopilot,
} from "../api/property.api";

import type { Property } from "../types/property.types";
import type { PropertyHealthResult } from "../types/property-health.types";
import type { PropertyCopilotResult } from "../types/property-copilot.types";

import CopilotPanel from "../components/CopilotPanel";

function PropertyDetailsPage() {
  const { id } = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [health, setHealth] = useState<PropertyHealthResult | null>(null);
  const [copilot, setCopilot] = useState<PropertyCopilotResult | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isCopilotLoading, setIsCopilotLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // Fetch property and health
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const [propertyData, healthData] = await Promise.all([
          getPropertyById(id),
          getPropertiesHealth(id),
        ]);

        setProperty(propertyData);
        setHealth(healthData);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        setError("Failed to load property.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Fetch AI Copilot separately
  useEffect(() => {
    const fetchCopilot = async () => {
      if (!id) return;

      try {
        setIsCopilotLoading(true);

        const copilotData = await getPropertyCopilot(id);

        setCopilot(copilotData);
      } catch (error) {
        console.error("Failed to fetch Copilot:", error);
      } finally {
        setIsCopilotLoading(false);
      }
    };

    fetchCopilot();
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  if (!property) {
    return (
      <div className="empty-state">
        <h3>Property Not Found</h3>
        <p>The requested property could not be located.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
            <h1 className="page-header-title" style={{ margin: 0 }}>{property.name}</h1>
            <span className={`badge ${property.isActive ? "badge-completed" : "badge-neutral"}`}>
              {property.isActive ? "Active Asset" : "Inactive"}
            </span>
          </div>
          <p className="page-header-subtitle">
            {property.address.street}, {property.address.city}, {property.address.state} {property.address.postalcode}
          </p>
        </div>
        <div className="page-header-actions">
          <a
            href={`https://www.google.com/maps?q=${property.location.latitude},${property.location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            🗺️ View on Google Maps
          </a>
        </div>
      </div>

      {/* Main Info Cards Grid */}
      <div className="grid-2">
        {/* Property Overview */}
        <div className="card">
          <h3 className="card-title">Property Details</h3>
          <div className="detail-meta-grid" style={{ marginBottom: "1rem" }}>
            <div className="meta-item">
              <span className="meta-label">Street</span>
              <span className="meta-value">{property.address.street}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">City / State</span>
              <span className="meta-value">{property.address.city}, {property.address.state}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Postal Code</span>
              <span className="meta-value">{property.address.postalcode}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Country</span>
              <span className="meta-value">{property.address.country}</span>
            </div>
          </div>
          {property.description && (
            <div>
              <span className="meta-label">Description</span>
              <p style={{ marginTop: "0.25rem", color: "var(--text-body)" }}>{property.description}</p>
            </div>
          )}
        </div>

        {/* Property Health Summary */}
        <div className="card">
          <h3 className="card-title">Live Health Diagnostics</h3>
          {health ? (
            <div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.25rem" }}>
                <div style={{ background: "var(--bg-card-subtle)", padding: "0.85rem 1.25rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                  <span className="meta-label">Health Score</span>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)" }}>
                    {health.healthScore}
                    <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/100</span>
                  </div>
                </div>
                <div>
                  <span className="meta-label">Risk Category</span>
                  <div style={{ marginTop: "0.25rem" }}>
                    <span className={`badge ${health.riskLevel === "HIGH" ? "badge-emergency" : health.riskLevel === "MEDIUM" ? "badge-high" : "badge-completed"}`}>
                      {health.riskLevel} Risk
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-meta-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "1rem" }}>
                <div className="meta-item">
                  <span className="meta-label">Total Requests</span>
                  <span className="meta-value">{health.totalRequests}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Open Requests</span>
                  <span className="meta-value">{health.openRequests}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Emergency</span>
                  <span className="meta-value" style={{ color: "var(--status-emergency-text)" }}>
                    {health.emergencyRequests}
                  </span>
                </div>
              </div>

              {health.reasons.length > 0 && (
                <div>
                  <span className="meta-label">Flagged Health Factors</span>
                  <ul style={{ margin: "0.35rem 0 0 0", paddingLeft: "1.25rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {health.reasons.map((reason, index) => (
                      <li key={index} style={{ marginBottom: "0.2rem" }}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>Property health data currently unavailable.</p>
          )}
        </div>
      </div>

      {/* Embedded AI Copilot */}
      <CopilotPanel copilot={copilot} isLoading={isCopilotLoading} />
    </div>
  );
}

export default PropertyDetailsPage;
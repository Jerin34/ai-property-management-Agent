import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPropertyById,
  getPropertiesHealth,
  getPropertyCopilot,
  uploadPropertyImages,
} from "../api/property.api";
import { useAuth } from "../context/useAuth";
import type { Property } from "../types/property.types";
import type { PropertyHealthResult } from "../types/property-health.types";
import type { PropertyCopilotResult } from "../types/property-copilot.types";
import CopilotPanel from "../components/CopilotPanel";

function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTenant = user?.role === "TENANT";
  const canManage = user?.role === "MANAGER" || user?.role === "ADMIN";
  const [property, setProperty] = useState<Property | null>(null);
  const [health, setHealth] = useState<PropertyHealthResult | null>(null);
  const [copilot, setCopilot] = useState<PropertyCopilotResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

 useEffect(() => {
  let active = true;

  const load = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      const propertyData = await getPropertyById(id);

      if (!active) return;

      setProperty(propertyData);

      if (!isTenant) {
        setIsCopilotLoading(true);

        try {
          const [healthData, copilotData] = await Promise.allSettled([
            getPropertiesHealth(id),
            getPropertyCopilot(id),
          ]);

          if (!active) return;

          if (healthData.status === "fulfilled") {
            setHealth(healthData.value);
          }

          if (copilotData.status === "fulfilled") {
            setCopilot(copilotData.value);
          }
        } finally {
          if (active) {
            setIsCopilotLoading(false);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch property:", err);

      if (active) {
        setError("Failed to load property. You may not have access to it.");
      }
    } finally {
      if (active) {
        setIsLoading(false);
      }
    }
  };

  void load();

  return () => {
    active = false;
  };
}, [id, isTenant]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!id || files.length === 0) return;
    try {
      setUploading(true);
      setUploadError("");
     
      const updated = await uploadPropertyImages(id, files);
      setProperty(updated);
      event.target.value = "";
    } catch (err) {
      console.error("Property image upload failed:", err);
      setUploadError("Unable to upload images. Use JPEG, PNG or WebP files up to 5 MB each (maximum 5 per upload).");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <div className="loading-container"><div className="spinner" /><p>Loading property details...</p></div>;
  if (error) return <div className="alert-error" role="alert">{error}</div>;
  if (!property) return <div className="empty-state"><h3>Property Not Found</h3><p>The requested property could not be located.</p></div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
            <h1 className="page-header-title" style={{ margin: 0 }}>{property.name}</h1>
            <span className={`badge ${property.isActive ? "badge-completed" : "badge-neutral"}`}>{property.isActive ? "Active" : "Inactive"}</span>
          </div>
          <p className="page-header-subtitle">{property.address.street}, {property.address.city}, {property.address.state} {property.address.postalcode}, {property.address.country}</p>
        </div>
        <div className="page-header-actions">
          {property.location && property.location.latitude != null && property.location.longitude != null && (
            <a href={`https://www.google.com/maps?q=${property.location.latitude},${property.location.longitude}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">View on Google Maps</a>
          )}
          {canManage && <button type="button" className="btn btn-primary" onClick={() => navigate(`/properties/${property._id}/edit`)}>Edit Property</button>}
        </div>
      </div>

      <section className="card" style={{ marginBottom: "1rem" }}>
        <h2 className="card-title">Property images</h2>
        {property.images?.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "0.75rem" }}>
            {property.images.map((image, index) => <img key={image + index} src={image} alt={`${property.name} - image ${index + 1}`} loading="lazy" style={{ width: "100%", height: 170, objectFit: "cover", borderRadius: "0.65rem" }} />)}
          </div>
        ) : <p className="page-header-subtitle">No property images have been uploaded yet.</p>}
        {canManage && (
          <div style={{ marginTop: "1rem" }}>
            <label htmlFor="property-images">Upload images (JPEG, PNG or WebP; up to 5 images, 5 MB each)</label>
            <input id="property-images" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} onChange={handleImageUpload} style={{ display: "block", marginTop: "0.5rem" }} />
            {uploading && <p>Uploading images...</p>}
            {uploadError && <p className="alert-error" role="alert">{uploadError}</p>}
          </div>
        )}
      </section>

      <div className="grid-2">
        <div className="card">
          <h3 className="card-title">Property Details</h3>
          <div className="detail-meta-grid" style={{ marginBottom: "1rem" }}>
            <div className="meta-item"><span className="meta-label">Street</span><span className="meta-value">{property.address.street}</span></div>
            <div className="meta-item"><span className="meta-label">City / State</span><span className="meta-value">{property.address.city}, {property.address.state}</span></div>
            <div className="meta-item"><span className="meta-label">Postal Code</span><span className="meta-value">{property.address.postalcode}</span></div>
            <div className="meta-item"><span className="meta-label">Country</span><span className="meta-value">{property.address.country}</span></div>
          </div>
          {property.description && <div><span className="meta-label">Description</span><p style={{ marginTop: "0.25rem", color: "var(--text-body)" }}>{property.description}</p></div>}
        </div>
        {canManage && (
          <div className="card">
            <h3 className="card-title">Live Health Diagnostics</h3>
            {health ? (
              <>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                  <div style={{ background: "var(--bg-card-subtle)", padding: "0.85rem 1.25rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                    <span className="meta-label">Health Score</span>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)" }}>{health.healthScore}<span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/100</span></div>
                  </div>
                  <div><span className="meta-label">Risk Category</span><div style={{ marginTop: "0.25rem" }}><span className={`badge ${health.riskLevel === "HIGH" ? "badge-emergency" : health.riskLevel === "MEDIUM" ? "badge-high" : "badge-completed"}`}>{health.riskLevel} Risk</span></div></div>
                </div>
                <div className="detail-meta-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "1rem" }}>
                  <div className="meta-item"><span className="meta-label">Total Requests</span><span className="meta-value">{health.totalRequests}</span></div>
                  <div className="meta-item"><span className="meta-label">Open Requests</span><span className="meta-value">{health.openRequests}</span></div>
                  <div className="meta-item"><span className="meta-label">Emergency</span><span className="meta-value">{health.emergencyRequests}</span></div>
                </div>
                {health.reasons.length > 0 && <div><span className="meta-label">Flagged Health Factors</span><ul>{health.reasons.map((reason, index) => <li key={index}>{reason}</li>)}</ul></div>}
              </>
            ) : <p className="page-header-subtitle">Property health data currently unavailable.</p>}
          </div>
        )}
      </div>
      {canManage && <CopilotPanel copilot={copilot} isLoading={isCopilotLoading} />}
    </div>
  );
}
export default PropertyDetailsPage;

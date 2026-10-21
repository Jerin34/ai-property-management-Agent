import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createMaintenanceSchedule } from "../api/maintenance-scheduler.api";
import { getProperties } from "../api/property.api";
import type { CreateMaintenanceSchedule } from "../types/maintenance-scheduler.types";
import type { Property } from "../types/property.types";

function CreateMaintenanceSchedulePage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setformData] = useState<CreateMaintenanceSchedule>({
    property: "",
    title: "",
    description: "",
    category: "OTHER",
    frequency: "MONTHLY",
    nextDueDate: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to load Properties", error);
        setError("Failed to load Properties");
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await createMaintenanceSchedule(formData);
      navigate("/maintenance/schedules");
    } catch (err) {
      console.error("Failed to create Maintenance Schedule", err);
      setError("Failed to create Maintenance Schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Create Maintenance Schedule</h1>
          <p className="page-header-subtitle">
            Configure a recurring routine or preventive inspection schedule for a property asset.
          </p>
        </div>
      </div>

      <div className="card">
        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="property">
              Target Property Asset <span style={{ color: "var(--status-emergency-text)" }}>*</span>
            </label>
            <select
              id="property"
              name="property"
              value={formData.property}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            >
              <option value="">Select Property</option>
              {properties.map((property) => (
                <option key={property._id} value={property._id}>
                  {property.name} ({property.address.city})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Schedule Title <span style={{ color: "var(--status-emergency-text)" }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Quarterly HVAC Filter Servicing"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Instructions & Scope
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details on scope of work, vendor requirements, replacement parts..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="PLUMBING">Plumbing</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="APPLIANCE">Appliance</option>
                <option value="STRUCTURAL">Structural</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="frequency">
                Frequency Cadence
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="nextDueDate">
                First Due Date <span style={{ color: "var(--status-emergency-text)" }}>*</span>
              </label>
              <input
                id="nextDueDate"
                type="date"
                name="nextDueDate"
                value={formData.nextDueDate}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "0.5rem" }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setformData((previous) => ({
                    ...previous,
                    isActive: e.target.checked,
                  }))
                }
                disabled={isSubmitting}
              />
              <span>Activate Schedule Immediately</span>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/maintenance/schedules")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMaintenanceSchedulePage;
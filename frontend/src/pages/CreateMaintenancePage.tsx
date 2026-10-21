import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMaintenanceRequest } from "../api/maintenance.api";

function CreateMaintenancePage() {
  const navigate = useNavigate();
  const [propertyId, setPropertyId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!propertyId.trim()) {
      setError("Property ID is required.");
      return;
    }
    if (title.trim().length < 3) {
      setError("Maintenance title must be at least 3 characters long.");
      return;
    }
    if (description.trim().length < 10) {
      setError("Maintenance description must be at least 10 characters long.");
      return;
    }
    try {
      setIsSubmitting(true);
      const maintenance = await createMaintenanceRequest({
        propertyId: propertyId.trim(),
        title: title.trim(),
        description: description.trim(),
      });
      navigate(`/maintenance/${maintenance._id}`, { replace: true });
    } catch (error) {
      console.log("Failed to create maintenance request", error);
      setError("Failed to create maintenance request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Create Maintenance Request</h1>
          <p className="page-header-subtitle">
            Submit a repair issue. Our AI triage system will automatically classify priority and summarize the issue.
          </p>
        </div>
      </div>

      <div className="card">
        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="propertyId">
              Property ID <span style={{ color: "var(--status-emergency-text)" }}>*</span>
            </label>
            <input
              id="propertyId"
              type="text"
              value={propertyId}
              onChange={(event) => setPropertyId(event.target.value)}
              placeholder="e.g. 64b8f0..."
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Request Title <span style={{ color: "var(--status-emergency-text)" }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. AC cooling unit leaking water"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Issue Description <span style={{ color: "var(--status-emergency-text)" }}>*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what happened, location inside property, severity, and any sounds or odors..."
              rows={5}
              disabled={isSubmitting}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting Request..." : "Submit Maintenance Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMaintenancePage;
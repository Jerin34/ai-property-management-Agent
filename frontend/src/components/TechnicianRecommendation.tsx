import type { TechnicianRecommendation } from "../types/technician.types";

interface TechnicianRecommendationsProps {
  recommendations: TechnicianRecommendation[];
  isLoading: boolean;
  isAssigning: boolean;
  onSelect: (technicianId: string) => void;
}

function TechnicianRecommendations({
  recommendations,
  isLoading,
  isAssigning,
  onSelect,
}: TechnicianRecommendationsProps) {
  if (isLoading) {
    return (
      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 className="card-title">🤖 AI Technician Recommendations</h3>
        <div className="loading-container" style={{ padding: "1.5rem" }}>
          <div className="spinner"></div>
          <p>Analyzing technician skills, workload, and location match...</p>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return (
      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 className="card-title">🤖 AI Technician Recommendations</h3>
        <div className="empty-state" style={{ padding: "1rem" }}>
          <p>No technician recommendations available for this request.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card card-ai" style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="badge badge-ai">Smart Match</span>
          <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Top Recommended Technicians</h3>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {recommendations.map((technician) => (
          <div
            key={technician.technicianId}
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem" }}>
                  {technician.technicianName}
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="badge badge-open">
                    Match Score: {technician.score}%
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onSelect(technician.technicianId)}
                disabled={isAssigning}
              >
                {isAssigning ? "Assigning..." : "Assign Technician"}
              </button>
            </div>

            <div>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Why This Recommendation?
              </span>
              <ul style={{ margin: "0.35rem 0 0 0", paddingLeft: "1.25rem", fontSize: "0.875rem", color: "var(--text-body)" }}>
                {technician.reasons.map((reason, index) => (
                  <li key={index} style={{ marginBottom: "0.2rem" }}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TechnicianRecommendations;
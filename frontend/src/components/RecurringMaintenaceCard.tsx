import type { RecurringMaintenance } from "../types/recurring-maintenance.types";

interface RecurringMaintenanceProps {
  data: RecurringMaintenance | null;
  isLoading: boolean;
}

function RecurringMaintenanceCard({
  data,
  isLoading,
}: RecurringMaintenanceProps) {
  if (isLoading) {
    return (
      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 className="card-title">🔄 Recurring Maintenance Check</h3>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>Checking historical patterns for recurring issues...</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 className="card-title">🔄 Recurring Maintenance Check</h3>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>Recurring maintenance information unavailable.</p>
      </section>
    );
  }

  return (
    <section
      className="card"
      style={{
        marginBottom: "1.5rem",
        borderLeft: data.isRecurring ? "4px solid var(--status-emergency-text)" : "4px solid var(--status-low-text)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <h3 className="card-title" style={{ margin: 0 }}>
          Recurring Issue Analysis
        </h3>
        <span className={`badge ${data.isRecurring ? "badge-emergency" : "badge-completed"}`}>
          {data.isRecurring ? "⚠️ Recurring Issue Detected" : "✓ Isolated Issue"}
        </span>
      </div>

      <div className="detail-meta-grid" style={{ marginBottom: "1rem" }}>
        <div className="meta-item">
          <span className="meta-label">Category</span>
          <span className="meta-value">{data.category}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Request Count</span>
          <span className="meta-value">{data.requestCount} incidents</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Evaluation Period</span>
          <span className="meta-value">{data.periodDays} days</span>
        </div>
      </div>

      {data.message && (
        <p style={{ fontSize: "0.9rem", color: "var(--text-body)", margin: 0 }}>
          <strong>Analysis:</strong> {data.message}
        </p>
      )}
    </section>
  );
}

export default RecurringMaintenanceCard;
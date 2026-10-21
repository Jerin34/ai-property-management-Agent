import { useEffect, useState } from "react";
import { getMaintenanceSLAMetrics } from "../api/maintenance-sla.api";
import type { MaintenanceSLAMetrics } from "../types/maintenance-sla.types";

function MaintenanceSLAPage() {
  const [metrics, setMetrics] = useState<MaintenanceSLAMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMaintenanceSLAMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Failed to load SLA metrics", err);
        setError("Failed to load SLA metrics");
      } finally {
        setIsLoading(false);
      }
    };
    loadMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading SLA metrics and compliance reports...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  if (!metrics) {
    return (
      <div className="empty-state">
        <h3>No SLA Data Available</h3>
        <p>There is currently no SLA metric history recorded.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Service Level Agreement (SLA) Analytics</h1>
          <p className="page-header-subtitle">
            Monitor response and resolution compliance rates against SLA thresholds.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3 className="kpi-card-title">Total Requests</h3>
          <div className="kpi-card-value">{metrics.totalRequests}</div>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-card-title">Completed Requests</h3>
          <div className="kpi-card-value" style={{ color: "var(--status-low-text)" }}>
            {metrics.completedRequests}
          </div>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-card-title">SLA Breaches</h3>
          <div className="kpi-card-value" style={{ color: "var(--status-emergency-text)" }}>
            {metrics.breachedRequests}
          </div>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-card-title">Compliance Rate</h3>
          <div
            className="kpi-card-value"
            style={{
              color:
                metrics.complianceRate >= 90
                  ? "var(--status-low-text)"
                  : metrics.complianceRate >= 75
                  ? "var(--status-high-text)"
                  : "var(--status-emergency-text)",
            }}
          >
            {metrics.complianceRate.toFixed(1)}%
          </div>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-card-title">Avg Resolution Time</h3>
          <div className="kpi-card-value" style={{ fontSize: "1.75rem", color: "var(--primary)" }}>
            {metrics.averageResolutionTimeHours.toFixed(1)} <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>hrs</span>
          </div>
        </div>
      </div>

      {/* SLA Breakdown Table */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Compliance Breakdown by Priority</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Priority Level</th>
                <th>Total Requests</th>
                <th>Breached Tickets</th>
                <th>Compliance Rate</th>
              </tr>
            </thead>
            <tbody>
              {metrics.byPriority.map((item) => {
                const rate = item.complianceRate;
                return (
                  <tr key={item.priority}>
                    <td>
                      <span
                        className={`badge ${
                          item.priority === "EMERGENCY"
                            ? "badge-emergency"
                            : item.priority === "HIGH"
                            ? "badge-high"
                            : item.priority === "MEDIUM"
                            ? "badge-medium"
                            : "badge-low"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td>
                      <strong>{item.totalRequests}</strong>
                    </td>
                    <td>
                      <span style={{ color: item.breachedRequests > 0 ? "var(--status-emergency-text)" : "var(--text-body)" }}>
                        {item.breachedRequests}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            rate >= 90
                              ? "var(--status-low-text)"
                              : rate >= 75
                              ? "var(--status-high-text)"
                              : "var(--status-emergency-text)",
                        }}
                      >
                        {rate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceSLAPage;

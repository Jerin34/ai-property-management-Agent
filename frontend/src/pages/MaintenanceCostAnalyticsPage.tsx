import { useEffect, useState } from "react";
import { getMaintenanceCostAnalytics } from "../api/maintenance-cost-analytics.api";
import type { MaintenanceCostAnalytics } from "../types/maintenance-cost-analytics.types";

function MaintenanceCostAnalyticsPage() {
  const [analytics, setAnalytics] = useState<MaintenanceCostAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMaintenanceCostAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load maintenance cost analytics", err);
        setError("Failed to load maintenance cost analytics");
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Calculating maintenance expenditure analytics...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  if (!analytics) {
    return (
      <div className="empty-state">
        <h3>No Cost Analytics Available</h3>
        <p>No recorded maintenance expenditures found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Maintenance Cost Analytics</h1>
          <p className="page-header-subtitle">
            Financial audit of estimated vs. actual repair expenses, labor allocation, and property budget impacts.
          </p>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3 className="kpi-card-title">Total Estimated Cost</h3>
          <div className="kpi-card-value">${analytics.totalEstimatedCost.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-card-title">Total Actual Cost</h3>
          <div className="kpi-card-value" style={{ color: "var(--primary)" }}>
            ${analytics.totalActualCost.toLocaleString()}
          </div>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-card-title">Total Labor Cost</h3>
          <div className="kpi-card-value">${analytics.totalLaborCost.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-card-title">Total Material Cost</h3>
          <div className="kpi-card-value">${analytics.totalMaterialCost.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-card-title">Cost Variance</h3>
          <div
            className="kpi-card-value"
            style={{
              color: analytics.costVariance > 0 ? "var(--status-emergency-text)" : "var(--status-low-text)",
            }}
          >
            {analytics.costVariance > 0 ? `+$${analytics.costVariance.toLocaleString()}` : `$${analytics.costVariance.toLocaleString()}`}
          </div>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-card-title">Avg Cost / Order</h3>
          <div className="kpi-card-value">${analytics.averageActualCost.toFixed(2)}</div>
        </div>
      </div>

      {/* Most Expensive Order Callout */}
      {analytics.mostExpensiveRequest && (
        <div className="card" style={{ marginBottom: "2rem", borderLeft: "4px solid var(--ai-primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <span className="badge badge-ai" style={{ marginBottom: "0.35rem" }}>Highest Single Expense</span>
              <h3 style={{ margin: 0, fontSize: "1.15rem" }}>{analytics.mostExpensiveRequest.title}</h3>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--status-emergency-text)" }}>
              ${analytics.mostExpensiveRequest.actualCost?.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Table Breakdown */}
      <div className="grid-2">
        {/* Cost by Category */}
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Cost by Category</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Actual Cost</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.byCategory).map(([category, cost]) => (
                  <tr key={category}>
                    <td>
                      <span className="badge badge-neutral">{category}</span>
                    </td>
                    <td>
                      <strong>${cost.toLocaleString()}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost by Property */}
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Cost by Property</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Actual Cost</th>
                </tr>
              </thead>
              <tbody>
                {analytics.byProperty.map((property) => (
                  <tr key={property.propertyId}>
                    <td>
                      <strong>{property.propertyName}</strong>
                    </td>
                    <td>
                      <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                        ${property.actualCost.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceCostAnalyticsPage;

import type { PropertyCopilotResult } from "../types/property-copilot.types";
import {
  parseCopilotAnalysis,
  parseCopilotList,
} from "../utils/copilotParser";

interface CopilotPanelProps {
  copilot: PropertyCopilotResult | null;
  isLoading: boolean;
}

function CopilotPanel({ copilot, isLoading }: CopilotPanelProps) {
  if (isLoading) {
    return (
      <section className="card-ai" style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
          <span className="badge badge-ai">✨ AI Copilot</span>
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Property Analysis</h2>
        </div>
        <div className="loading-container" style={{ padding: "2rem 1rem" }}>
          <div className="spinner"></div>
          <p>AI is analyzing real-time telemetry, maintenance trends, and asset health...</p>
        </div>
      </section>
    );
  }

  if (!copilot) {
    return (
      <section className="card-ai" style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
          <span className="badge badge-ai">✨ AI Copilot</span>
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Property Analysis</h2>
        </div>
        <div className="empty-state" style={{ padding: "1.5rem" }}>
          <p>AI analysis currently unavailable for this property.</p>
        </div>
      </section>
    );
  }

  const parsed = parseCopilotAnalysis(copilot.analysis);
  const mainProblems = parseCopilotList(parsed.mainProblems);
  const recommendedActions = parseCopilotList(parsed.recommendedActions);
  const health = copilot.health;

  const getRiskBadge = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case "HIGH":
      case "CRITICAL":
        return "badge-emergency";
      case "MEDIUM":
        return "badge-high";
      default:
        return "badge-completed";
    }
  };

  return (
    <section className="card-ai" style={{ marginTop: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="sidebar-logo-icon" style={{ width: "32px", height: "32px", fontSize: "0.95rem" }}>
            ✨
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700 }}>
              AI Property Copilot
            </h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Automated diagnostic intelligence for {copilot.property.name}
            </p>
          </div>
        </div>
        <span className={`badge ${getRiskBadge(health.riskLevel)}`} style={{ fontSize: "0.85rem", padding: "0.35rem 0.85rem" }}>
          Risk Level: {health.riskLevel}
        </span>
      </div>

      {/* Health Overview Grid */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
          Health Diagnostics
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.75rem",
          }}
        >
          <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Health Score</span>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--ai-primary)", marginTop: "0.25rem" }}>
              {health.healthScore}<span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/100</span>
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Risk Level</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.25rem" }}>
              {health.riskLevel}
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Total Requests</span>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.25rem" }}>
              {health.totalRequests}
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Open Requests</span>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)", marginTop: "0.25rem" }}>
              {health.openRequests}
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>High Priority</span>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--status-high-text)", marginTop: "0.25rem" }}>
              {health.highPriorityRequests}
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Emergency</span>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--status-emergency-text)", marginTop: "0.25rem" }}>
              {health.emergencyRequests}
            </div>
          </div>
        </div>
      </div>

      {/* Health Factors */}
      {health.reasons.length > 0 && (
        <div style={{ marginBottom: "1.5rem", background: "#ffffff", padding: "1rem 1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>Health Factors</h4>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-body)", fontSize: "0.9rem" }}>
            {health.reasons.map((reason, index) => (
              <li key={index} style={{ marginBottom: "0.25rem" }}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Analysis Sections Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {/* Overall Summary */}
        <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--ai-primary)", margin: "0 0 0.5rem 0" }}>📋 Overall Summary</h4>
          <p style={{ fontSize: "0.9rem", color: "var(--text-body)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
            {parsed.overallSummary}
          </p>
        </div>

        {/* Most Important Priority */}
        <div style={{ background: "var(--status-high-bg)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--status-high-border)" }}>
          <h4 style={{ color: "var(--status-high-text)", margin: "0 0 0.5rem 0" }}>⚡ Most Important Priority</h4>
          <p style={{ fontSize: "0.9rem", color: "var(--status-high-text)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", fontWeight: 500 }}>
            {parsed.mostImportantPriority}
          </p>
        </div>
      </div>

      {/* Main Problems & Maintenance Patterns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {/* Main Problems */}
        <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--status-emergency-text)", margin: "0 0 0.5rem 0" }}>⚠️ Identified Problems</h4>
          {mainProblems.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>No major problems identified.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-body)", fontSize: "0.9rem" }}>
              {mainProblems.map((problem, index) => (
                <li key={index} style={{ marginBottom: "0.35rem" }}>{problem}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Risk Explanation & Patterns */}
        <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--text-main)", margin: "0 0 0.5rem 0" }}>🔍 Risk Assessment & Patterns</h4>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.5rem", whiteSpace: "pre-wrap" }}>
            {parsed.riskExplanation}
          </p>
          {parsed.maintenancePatterns && (
            <div style={{ paddingTop: "0.5rem", borderTop: "1px dashed var(--border)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Recurring Patterns</span>
              <p style={{ fontSize: "0.85rem", color: "var(--text-body)", margin: "0.25rem 0 0 0", whiteSpace: "pre-wrap" }}>
                {parsed.maintenancePatterns}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Actions */}
      <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
        <h4 style={{ color: "var(--primary)", margin: "0 0 0.75rem 0" }}>💡 Recommended Action Plan</h4>
        {recommendedActions.length === 0 ? (
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>No recommended actions available.</p>
        ) : (
          <ol style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-body)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {recommendedActions.map((action, index) => (
              <li key={index} style={{ marginBottom: "0.4rem" }}>{action}</li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

export default CopilotPanel;
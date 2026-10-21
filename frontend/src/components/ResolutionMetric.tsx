interface ResolutionMetricProps {
  averageResolutionTimeHours: number;
}

function ResolutionMetric({ averageResolutionTimeHours }: ResolutionMetricProps) {
  return (
    <div className="card">
      <h3 className="card-title">Average Resolution Time</h3>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginTop: "0.5rem" }}>
        <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--primary)" }}>
          {averageResolutionTimeHours}
        </span>
        <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 500 }}>
          hours
        </span>
      </div>
      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
        Mean turnaround time from ticket submission to completion
      </p>
    </div>
  );
}

export default ResolutionMetric;
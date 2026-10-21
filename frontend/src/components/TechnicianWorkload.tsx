interface Technician {
  technicianId: string;
  technicianName: string;
  totalRequests: number;
  inProgressRequests: number;
  completedRequests: number;
}

interface TechnicianWorkLoadProps {
  data: Technician[];
}

function TechnicianWorkLoad({ data }: TechnicianWorkLoadProps) {
  return (
    <div className="card">
      <h3 className="card-title">Technician Workload</h3>
      {data.length === 0 ? (
        <div className="empty-state" style={{ padding: "1.5rem" }}>
          <p>No technicians found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {data.map((technician) => (
            <div
              key={technician.technicianId}
              style={{
                padding: "0.85rem 1rem",
                background: "var(--bg-card-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                  {technician.technicianName}
                </span>
                <span className="badge badge-neutral">Total: {technician.totalRequests}</span>
              </div>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <span>In Progress: <strong style={{ color: "var(--text-main)" }}>{technician.inProgressRequests}</strong></span>
                <span>Completed: <strong style={{ color: "var(--text-main)" }}>{technician.completedRequests}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TechnicianWorkLoad;
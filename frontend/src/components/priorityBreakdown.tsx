interface PriorityBreakdownProps {
  data: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    EMERGENCY: number;
  };
}

function PriorityBreakdown({ data }: PriorityBreakdownProps) {
  return (
    <div className="card">
      <h3 className="card-title">Requests by Priority</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="badge badge-emergency">Emergency</span>
          <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{data.EMERGENCY}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="badge badge-high">High</span>
          <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{data.HIGH}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="badge badge-medium">Medium</span>
          <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{data.MEDIUM}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="badge badge-low">Low</span>
          <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{data.LOW}</span>
        </div>
      </div>
    </div>
  );
}

export default PriorityBreakdown;
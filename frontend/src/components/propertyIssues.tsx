interface PropertyIssues {
  propertyId: string;
  propertyName: string;
  requestCount: number;
}

interface PropertyIssuesProps {
  data: PropertyIssues[];
}

function PropertyIssues({ data }: PropertyIssuesProps) {
  return (
    <div className="card">
      <h3 className="card-title">Property Issues</h3>
      {data.length === 0 ? (
        <div className="empty-state" style={{ padding: "1.5rem" }}>
          <p>No Property Issues Available</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {data.map((property) => (
            <div
              key={property.propertyId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                background: "var(--bg-card-subtle)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.9rem" }}>
                {property.propertyName}
              </span>
              <span className="badge badge-high">{property.requestCount} Requests</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertyIssues;
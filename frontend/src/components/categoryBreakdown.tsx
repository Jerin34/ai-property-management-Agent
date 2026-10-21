interface CategoryBreakdownProps {
  data: {
    PLUMBING: number;
    ELECTRICAL: number;
    HVAC: number;
    APPLIANCE: number;
    STRUCTURAL: number;
    OTHER: number;
  };
}

function CategroyBreakdown({ data }: CategoryBreakdownProps) {
  const categories = [
    { label: "Plumbing", value: data.PLUMBING },
    { label: "Electrical", value: data.ELECTRICAL },
    { label: "HVAC", value: data.HVAC },
    { label: "Appliance", value: data.APPLIANCE },
    { label: "Structural", value: data.STRUCTURAL },
    { label: "Other", value: data.OTHER },
  ];

  return (
    <div className="card">
      <h3 className="card-title">Requests by Category</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
        {categories.map((cat) => (
          <div
            key={cat.label}
            style={{
              padding: "0.65rem 0.85rem",
              background: "var(--bg-card-subtle)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
              {cat.label}
            </span>
            <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>
              {cat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategroyBreakdown;

import type { MaintenanceUpdates } from "../types/maintenance.types";

interface MaintenanceUpdatesProps {
  updates: MaintenanceUpdates[];
}

function MaintenancesUpdates({ updates }: MaintenanceUpdatesProps) {
  return (
    <div className="card" style={{ marginBottom: "1.5rem" }}>
      <h3 className="card-title">Activity & Progress Updates</h3>

      {updates.length === 0 ? (
        <div className="empty-state" style={{ padding: "1.5rem" }}>
          <p>No activity updates recorded yet.</p>
        </div>
      ) : (
        <div className="timeline">
          {updates.map((update) => (
            <div key={update._id} className="timeline-item">
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-main)", fontWeight: 500 }}>
                  {update.message}
                </p>
                {update.createdAt && (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {new Date(update.createdAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MaintenancesUpdates;
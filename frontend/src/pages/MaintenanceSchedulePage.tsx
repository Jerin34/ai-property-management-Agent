import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMaintenanceSchedules,
  getDueMaintenanceSchedules,
  processDueMaintenanceSchedules,
} from "../api/maintenance-scheduler.api";
import type { MaintenanceSchedule } from "../types/maintenance-scheduler.types";

function MaintenanceSchedulerPage() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [dueSchedules, setDueSchedules] = useState<MaintenanceSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadSchedules = async () => {
    try {
      const [allSchedules, due] = await Promise.all([
        getMaintenanceSchedules(),
        getDueMaintenanceSchedules(),
      ]);
      setSchedules(allSchedules);
      setDueSchedules(due);
    } catch (err) {
      console.error("Failed to load maintenance schedules", err);
      setError("Failed to load maintenance schedules");
    }
  };

  useEffect(() => {
    const loadInitialSchedules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await loadSchedules();
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialSchedules();
  }, []);

  const handleProcessDueSchedules = async () => {
    try {
      setIsProcessing(true);
      await processDueMaintenanceSchedules();
      await loadSchedules();
    } catch (err) {
      console.error("Failed to process due schedules", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading preventive maintenance schedules...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Preventive Maintenance Scheduler</h1>
          <p className="page-header-subtitle">
            Automate recurring inspection intervals, routine equipment servicing, and preventative repairs.
          </p>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/maintenance/schedules/create")}
          >
            + Create Schedule
          </button>
        </div>
      </div>

      {/* KPI Cards and Action Banner */}
      <div className="kpi-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="kpi-card">
          <h3 className="kpi-card-title">Total Active Schedules</h3>
          <div className="kpi-card-value">{schedules.length}</div>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-card-title">Due for Generation</h3>
          <div
            className="kpi-card-value"
            style={{
              color: dueSchedules.length > 0 ? "var(--status-emergency-text)" : "var(--status-low-text)",
            }}
          >
            {dueSchedules.length}
          </div>
        </div>
      </div>

      {/* Process Due Action Callout */}
      {dueSchedules.length > 0 && (
        <div
          className="card"
          style={{
            marginBottom: "1.75rem",
            background: "var(--status-high-bg)",
            border: "1px solid var(--status-high-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h4 style={{ margin: 0, color: "var(--status-high-text)" }}>
              ⚠️ {dueSchedules.length} Preventive Maintenance Tasks Due
            </h4>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--status-high-text)" }}>
              Trigger automated generation of maintenance work orders for all tasks matching their scheduled cadence.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleProcessDueSchedules}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Process Due Schedules Now"}
          </button>
        </div>
      )}

      {/* Schedules Table */}
      <h2 style={{ fontSize: "1.25rem", marginBottom: "0.85rem" }}>Configured Maintenance Cadences</h2>
      {schedules.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📅</span>
          <h3>No Schedules Configured</h3>
          <p>Create your first recurring inspection or servicing cadence.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Schedule Title</th>
                <th>Category</th>
                <th>Cadence</th>
                <th>Next Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule._id}>
                  <td>
                    <strong style={{ color: "var(--text-main)" }}>{schedule.title}</strong>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{schedule.category}</span>
                  </td>
                  <td>{schedule.frequency}</td>
                  <td>{new Date(schedule.nextDueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${schedule.isActive ? "badge-completed" : "badge-neutral"}`}>
                      {schedule.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MaintenanceSchedulerPage;

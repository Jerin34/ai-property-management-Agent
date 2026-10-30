import { useState, useEffect } from "react";
import getMaintenaceAnalytics from "../api/analytics.api";
import type { MaintenanceAnalytics } from "../types/analytics.types";
import KpiCard from "../components/kpicards";
import PriorityBreakdown from "../components/priorityBreakdown";
import CategroyBreakdown from "../components/categoryBreakdown";
import TechnicianWorkLoad from "../components/TechnicianWorkload";
import PropertyIssues from "../components/propertyIssues";
import ResolutionMetric from "../components/ResolutionMetric";
import { useAuth } from "../context/Authcontext";
import { Link } from "react-router-dom";
import { getManagerPropertyRequests } from "../api/property.api";
import {
  getMaintenanceRequests,
  getTechnicianMaintenanceRequests,
} from "../api/maintenance.api";
import type { Maintenance } from "../types/maintenance.types";

const isTechnicianRole = (role: string | undefined) => role === "TECHNICIAN";

function DashboardPage() {
  const [analytics, setAnalytics] = useState<MaintenanceAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [pendingTenantRequestCount, setPendingTenantRequestCount] = useState(0);
  const [roleMaintenance, setRoleMaintenance] = useState<Maintenance[]>([]);
  const [isRoleDashboardLoading, setIsRoleDashboardLoading] = useState(true);
  const [roleDashboardError, setRoleDashboardError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoleMaintenance = async () => {
      if (user?.role !== "TENANT" && user?.role !== "TECHNICIAN") {
        setIsRoleDashboardLoading(false);
        return;
      }

      setIsRoleDashboardLoading(true);
      setRoleDashboardError(null);
      setRoleMaintenance([]);

      try {
        const requests = user.role === "TENANT"
          ? await getMaintenanceRequests()
          : await getTechnicianMaintenanceRequests();
        setRoleMaintenance(requests);
      } catch {
        setRoleDashboardError(
          user.role === "TENANT"
            ? "Could not load your maintenance requests. Please try again."
            : "Could not load your assigned work. Please try again."
        );
      } finally {
        setIsRoleDashboardLoading(false);
      }
    };

    fetchRoleMaintenance();
  }, [user]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMaintenaceAnalytics();
        setAnalytics(data);
      } catch {
        setError("Failed to fetch the analytics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [user]);

  useEffect(() => {
    if (user?.role !== "MANAGER") return;
    getManagerPropertyRequests()
      .then((requests) => setPendingTenantRequestCount(requests.length))
      .catch((requestError) => console.error("Failed to load tenant request count:", requestError));
  }, [user]);

  const requestCounts = {
    total: roleMaintenance.length,
    open: roleMaintenance.filter((request) => request.status === "OPEN").length,
    inProgress: roleMaintenance.filter((request) => request.status === "IN_PROGRESS").length,
    completed: roleMaintenance.filter((request) => request.status === "COMPLETED").length,
  };
  const recentRequests = [...roleMaintenance]
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))
    .slice(0, 3);

  const getStatusBadgeClass = (status: Maintenance["status"]) => {
    switch (status) {
      case "OPEN":
        return "badge-open";
      case "IN_PROGRESS":
        return "badge-in-progress";
      case "COMPLETED":
        return "badge-completed";
    }
  };

  if (user?.role === "TENANT" || user?.role === "TECHNICIAN") {
    if (isRoleDashboardLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>
            {user.role === "TENANT"
              ? "Loading your maintenance overview..."
              : "Loading your assigned work overview..."}
          </p>
        </div>
      );
    }

    if (roleDashboardError) {
      return (
        <div className="role-dashboard">
          <div className="page-header">
            <div className="page-header-left">
              <h1 className="page-header-title">
                {user.role === "TENANT" ? "Resident dashboard" : "Work overview"}
              </h1>
              <p className="page-header-subtitle">
                {user.role === "TENANT"
                  ? "Your property and maintenance requests, in one place."
                  : "A quick view of your assigned maintenance work."}
              </p>
            </div>
          </div>
          <div className="alert-error" role="alert">{roleDashboardError}</div>
        </div>
      );
    }

    if (user.role === "TENANT") {
      return (
        <div className="role-dashboard">
          <div className="page-header">
            <div className="page-header-left">
              <h1 className="page-header-title">Your home, at a glance</h1>
              <p className="page-header-subtitle">
                Keep track of your maintenance and find help when you need it.
              </p>
            </div>
            <div className="role-dashboard-actions">
              <Link className="btn btn-secondary" to="/my-property">View my property</Link>
              <Link className="btn btn-primary" to="/maintenance/create">Create a request</Link>
            </div>
          </div>

          <section className="kpi-grid role-dashboard-summary" aria-label="Maintenance request summary">
            <KpiCard title="Total Requests" value={requestCounts.total} />
            <KpiCard title="Open" value={requestCounts.open} />
            <KpiCard title="In Progress" value={requestCounts.inProgress} />
            <KpiCard title="Completed" value={requestCounts.completed} />
          </section>

          <section className="card role-dashboard-recent" aria-labelledby="tenant-recent-requests">
            <div className="role-dashboard-section-header">
              <div>
                <h2 id="tenant-recent-requests">Recent maintenance</h2>
                <p>Your latest requests and their current status.</p>
              </div>
              <Link className="role-dashboard-text-link" to="/maintenance">View all requests</Link>
            </div>

            {recentRequests.length === 0 ? (
              <div className="role-dashboard-empty">
                <p>You have no maintenance requests yet.</p>
                <Link className="btn btn-primary" to="/maintenance/create">Submit your first request</Link>
              </div>
            ) : (
              <ul className="role-dashboard-request-list">
                {recentRequests.map((request) => (
                  <li className="role-dashboard-request" key={request._id}>
                    <div className="role-dashboard-request-copy">
                      <Link className="role-dashboard-request-title" to={`/maintenance/${request._id}`}>
                        {request.title}
                      </Link>
                      <span className="role-dashboard-request-meta">
                        {request.category.replace("_", " ")}
                      </span>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                      {request.status.replace("_", " ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      );
    }

    return (
      <div className="role-dashboard">
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-header-title">Your work overview</h1>
            <p className="page-header-subtitle">
              See what needs attention and jump straight into your assigned jobs.
            </p>
          </div>
          <div className="role-dashboard-actions">
            <Link className="btn btn-primary" to="/technician/maintenance">Open my assignments</Link>
          </div>
        </div>

        <section className="kpi-grid role-dashboard-summary" aria-label="Assigned maintenance summary">
          <KpiCard title="Assigned Requests" value={requestCounts.total} />
          <KpiCard title="Open" value={requestCounts.open} />
          <KpiCard title="In Progress" value={requestCounts.inProgress} />
          <KpiCard title="Completed" value={requestCounts.completed} />
        </section>

        <section className="card role-dashboard-recent" aria-labelledby="technician-recent-assignments">
          <div className="role-dashboard-section-header">
            <div>
              <h2 id="technician-recent-assignments">Assigned work</h2>
              <p>Recent jobs from your technician queue.</p>
            </div>
            <Link className="role-dashboard-text-link" to="/technician/maintenance">View all assignments</Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="role-dashboard-empty">
              <p>You have no maintenance requests assigned right now.</p>
              <Link className="btn btn-secondary" to="/technician/maintenance">Open assignments</Link>
            </div>
          ) : (
            <ul className="role-dashboard-request-list">
              {recentRequests.map((request) => (
                <li className="role-dashboard-request" key={request._id}>
                  <div className="role-dashboard-request-copy">
                    <Link className="role-dashboard-request-title" to={`/maintenance/${request._id}`}>
                      {request.title}
                    </Link>
                    <span className="role-dashboard-request-meta">
                      {request.category.replace("_", " ")} · {request.priority}
                    </span>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                    {request.status.replace("_", " ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading analytics dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  if (!analytics) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">📊</span>
        <h3>No Dashboard Data Available</h3>
        <p>
          { isTechnicianRole(user?.role)
            ? "Your account role accesses operational workflows via the navigation sidebar."
            : "No maintenance analytics data found in the system."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Operations Dashboard</h1>
          <p className="page-header-subtitle">
            Real-time portfolio maintenance performance, technician workload, and resolution metrics.
          </p>
        </div>
      </div>

      {user?.role === "MANAGER" && pendingTenantRequestCount > 0 && (
        <div className="card" style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h3 style={{ margin: 0 }}>Tenant stay requests</h3>
            <p className="page-header-subtitle" style={{ marginBottom: 0 }}>{pendingTenantRequestCount} tenant request(s) are waiting for your approval.</p>
          </div>
          <Link className="btn btn-primary" to="/tenant-requests">Review Requests</Link>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="kpi-grid">
        <KpiCard title="Total Requests" value={analytics.overview.totalRequests} />
        <KpiCard title="Open Requests" value={analytics.overview.openRequests} />
        <KpiCard title="In Progress Requests" value={analytics.overview.inProgressRequests} />
        <KpiCard title="Completed Requests" value={analytics.overview.completedRequests} />
      </div>

      {/* Grid Row: Priority & Category Breakdowns */}
      <div className="grid-2">
        <PriorityBreakdown data={analytics.byPriority} />
        <CategroyBreakdown data={analytics.byCategory} />
      </div>

      {/* Grid Row: Workload, Issues & Turnaround */}
      <div className="grid-3">
        <TechnicianWorkLoad data={analytics.technicianWorkload} />
        <PropertyIssues data={analytics.propertyIssues} />
        <ResolutionMetric averageResolutionTimeHours={analytics.resolutionMetrics.averageResolutionTimeHours} />
      </div>
    </div>
  );
}

export default DashboardPage;
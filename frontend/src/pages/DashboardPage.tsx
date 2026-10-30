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
import TenantPropertyPage from "./TenantPropertyPage";
import { Link } from "react-router-dom";
import { getManagerPropertyRequests } from "../api/property.api";

function DashboardPage() {
  const [analytics, setAnalytics] = useState<MaintenanceAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [pendingTenantRequestCount, setPendingTenantRequestCount] = useState(0);

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
      } catch (error) {
        console.log("Failed to fetch the analytics", error);
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

  if (user?.role === "TENANT") {
    return <TenantPropertyPage />;
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
          {user?.role === "TENANT" || user?.role === "TECHNICIAN"
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
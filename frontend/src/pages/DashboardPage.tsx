import { useState, useEffect } from "react";
import getMaintenaceAnalytics from "../api/analytics.api";
import type { MaintenanceAnalytics } from "../types/analytics.types";
import KpiCard from "../components/kpicards";
import PriorityBreakdown from "../components/priorityBreakdown";
import CategroyBreakdown from "../components/categoryBreakdown";
import TechnicianWorkLoad from "../components/TechnicianWorkload";
import PropertyIssues from "../components/propertyIssues";
import ResolutionMetric from "../components/ResolutionMetric";
import { useAuth } from "../context/useAuth";
import TenantPropertyPage from "./TenantPropertyPage";
import { Link } from "react-router-dom";
import { getManagerPropertyRequests } from "../api/property.api";
import { getTechnicianProfile } from "../api/technician.api";

function DashboardPage() {
  const [analytics, setAnalytics] = useState<MaintenanceAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [technicianProfileCompleted, setTechnicianProfileCompleted] =
    useState(false);
  const [technicianProfileLoading, setTechnicianProfileLoading] =
    useState(false);

  const [pendingTenantRequestCount, setPendingTenantRequestCount] =
    useState(0);

  const { user } = useAuth();

  // Fetch Technician profile
  useEffect(() => {
    if (user?.role !== "TECHNICIAN") return;

    let cancelled = false;

    const fetchTechnicianProfile = async () => {
      setTechnicianProfileLoading(true);

      try {
        const profile = await getTechnicianProfile();

        if (!cancelled) {
          setTechnicianProfileCompleted(profile.profileCompleted);
        }
      } catch (error) {
        console.error("Failed to fetch Technician profile:", error);

        if (!cancelled) {
          setError("Failed to load Technician profile. Please refresh.");
        }
      } finally {
        if (!cancelled) {
          setTechnicianProfileLoading(false);
        }
      }
    };

    void fetchTechnicianProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Fetch Admin and Manager analytics
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
        console.error("Failed to fetch analytics:", error);
        setError("Failed to fetch the analytics.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAnalytics();
  }, [user]);

  // Fetch Manager pending tenant requests
  useEffect(() => {
    if (user?.role !== "MANAGER") return;

    getManagerPropertyRequests()
      .then((requests) => setPendingTenantRequestCount(requests.length))
      .catch((requestError) =>
        console.error(
          "Failed to load tenant request count:",
          requestError
        )
      );
  }, [user]);

  // Tenant dashboard
  if (user?.role === "TENANT") {
    return <TenantPropertyPage />;
  }

  // Technician dashboard
  if (user?.role === "TECHNICIAN") {
    if (technicianProfileLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading Technician workspace...</p>
        </div>
      );
    }

    if (error) {
      return <div className="alert-error">{error}</div>;
    }

    return (
      <section className="technician-dashboard">
        <div className="dashboard-welcome technician-welcome">
          <div>
            <span className="dashboard-eyebrow">YOUR WORKSPACE</span>
            <h1>Welcome back, {user?.name?.split(" ")[0] || "Technician"}</h1>
            <p>Keep track of your assigned maintenance work and profile readiness.</p>
          </div>
          <div className="dashboard-welcome-mark" aria-hidden="true">✦</div>
        </div>

        <div className="technician-status-card">
          <div className="technician-status-icon" aria-hidden="true">🛠️</div>
          <div className="technician-status-copy">
            {technicianProfileCompleted ? (
              <>
                <span className="dashboard-status-label is-ready">PROFILE READY</span>
                <h2>Your technician profile is complete</h2>
                <p>You are eligible to receive maintenance assignments.</p>
              </>
            ) : (
              <>
                <span className="dashboard-status-label is-pending">ACTION REQUIRED</span>
                <h2>Complete your technician profile</h2>
                <p>Add your skills, experience, service areas and availability to become eligible for assignments.</p>
              </>
            )}
          </div>
          {!technicianProfileCompleted && (
            <Link className="btn btn-primary" to="/technician/profile">
              Complete profile
            </Link>
          )}
        </div>

        <div className="technician-quick-link">
          <div>
            <span className="dashboard-eyebrow">WORK QUEUE</span>
            <h3>Ready to manage your assignments?</h3>
            <p>Open your maintenance workspace to review and update assigned requests.</p>
          </div>
          <Link className="btn btn-primary" to="/technician/maintenance">
            View my assignments <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    );
  }

  // Admin and Manager loading state
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
        <p>No maintenance analytics data found in the system.</p>
      </div>
    );
  }

  return (
    <section className="operations-dashboard">
      <header className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <span className="dashboard-eyebrow">PROPERTY OPERATIONS</span>
          <h1>Good to see you, {user?.name?.split(" ")[0] || "there"}.</h1>
          <p>Here’s what’s happening across your maintenance operations today.</p>
          <div className="dashboard-welcome-meta">
            <span className="dashboard-live-dot" />
            Operations overview
            <span className="dashboard-meta-divider">/</span>
            {user?.role === "ADMIN" ? "Administrator" : "Manager"} view
          </div>
        </div>
        <div className="dashboard-welcome-actions">
          <Link className="dashboard-button dashboard-button-light" to="/maintenance">
            View requests <span aria-hidden="true">↗</span>
          </Link>
          <Link className="dashboard-button dashboard-button-primary" to="/properties">
            Browse properties <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="dashboard-welcome-orb dashboard-welcome-orb-one" />
        <div className="dashboard-welcome-orb dashboard-welcome-orb-two" />
      </header>

      {user?.role === "MANAGER" && pendingTenantRequestCount > 0 && (
        <aside className="dashboard-request-alert">
          <div className="dashboard-alert-symbol" aria-hidden="true">!</div>
          <div className="dashboard-alert-copy">
            <strong>{pendingTenantRequestCount} tenant request{pendingTenantRequestCount === 1 ? "" : "s"} need your attention</strong>
            <span>Review pending stay requests for your properties.</span>
          </div>
          <Link className="dashboard-alert-link" to="/tenant-requests">
            Review requests <span aria-hidden="true">→</span>
          </Link>
        </aside>
      )}

      <div className="dashboard-section-heading">
        <div>
          <span className="dashboard-eyebrow">AT A GLANCE</span>
          <h2>Maintenance overview</h2>
        </div>
        <span className="dashboard-section-note">Current portfolio snapshot</span>
      </div>

      <div className="kpi-grid dashboard-kpi-grid">
        <KpiCard
          title="Total Requests"
          value={analytics.overview.totalRequests}
        />
        <KpiCard
          title="Open Requests"
          value={analytics.overview.openRequests}
        />
        <KpiCard
          title="In Progress Requests"
          value={analytics.overview.inProgressRequests}
        />
        <KpiCard
          title="Completed Requests"
          value={analytics.overview.completedRequests}
        />
      </div>

      <div className="dashboard-section-heading dashboard-section-heading-spaced">
        <div>
          <span className="dashboard-eyebrow">REQUEST INSIGHTS</span>
          <h2>Where attention is needed</h2>
        </div>
        <span className="dashboard-section-note">Priority & category distribution</span>
      </div>

      <div className="grid-2 dashboard-insight-grid">
        <PriorityBreakdown data={analytics.byPriority} />
        <CategroyBreakdown data={analytics.byCategory} />
      </div>

      <div className="dashboard-section-heading dashboard-section-heading-spaced">
        <div>
          <span className="dashboard-eyebrow">TEAM & PORTFOLIO</span>
          <h2>Operational performance</h2>
        </div>
        <span className="dashboard-section-note">Workload, property issues & resolution</span>
      </div>

      <div className="grid-3 dashboard-performance-grid">
        <TechnicianWorkLoad data={analytics.technicianWorkload} />
        <PropertyIssues data={analytics.propertyIssues} />
        <ResolutionMetric
          averageResolutionTimeHours={
            analytics.resolutionMetrics.averageResolutionTimeHours
          }
        />
      </div>
    </section>
  );
}

export default DashboardPage;

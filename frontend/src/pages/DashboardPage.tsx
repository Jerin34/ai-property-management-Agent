
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
      <div className="empty-state">
        <span className="empty-state-icon">🛠️</span>

        {technicianProfileCompleted ? (
          <>
            <h3>Technician Workspace</h3>
            <p>
              Your Technician profile is complete. You are eligible
              to receive maintenance assignments.
            </p>
          </>
        ) : (
          <>
            <h3>Complete Your Technician Profile</h3>
            <p>
              Complete your skills, experience, service areas and
              availability to become eligible for maintenance assignments.
            </p>

            <Link
              className="btn btn-primary"
              to="/technician/profile"
            >
              Complete Technician Profile
            </Link>
          </>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <Link
            className="btn btn-secondary"
            to="/technician/maintenance"
          >
            View My Assignments
          </Link>
        </div>
      </div>
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
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">
            Operations Dashboard
          </h1>

          <p className="page-header-subtitle">
            Real-time portfolio maintenance performance, technician
            workload, and resolution metrics.
          </p>
        </div>
      </div>

      {user?.role === "MANAGER" &&
        pendingTenantRequestCount > 0 && (
          <div
            className="card"
            style={{
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>Tenant stay requests</h3>

              <p
                className="page-header-subtitle"
                style={{ marginBottom: 0 }}
              >
                {pendingTenantRequestCount} tenant request(s) are
                waiting for your approval.
              </p>
            </div>

            <Link className="btn btn-primary" to="/tenant-requests">
              Review Requests
            </Link>
          </div>
        )}

      {/* KPI Overview */}
      <div className="kpi-grid">
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

      {/* Priority and Category */}
      <div className="grid-2">
        <PriorityBreakdown data={analytics.byPriority} />
        <CategroyBreakdown data={analytics.byCategory} />
      </div>

      {/* Workload, Issues and Resolution */}
      <div className="grid-3">
        <TechnicianWorkLoad data={analytics.technicianWorkload} />
        <PropertyIssues data={analytics.propertyIssues} />
        <ResolutionMetric
          averageResolutionTimeHours={
            analytics.resolutionMetrics.averageResolutionTimeHours
          }
        />
      </div>
    </div>
  );
}

export default DashboardPage;

import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationsAsRead,
} from "../api/notification.api";
import { useAuth } from "../context/Authcontext";
import type { Notification } from "../types/notification.types";
import NotificationPreferences from "../components/NotificationPreferences";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const isTenant = user?.role === "TENANT";
  const isManager = user?.role === "MANAGER";
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotifications();

        if (isMounted) {
          setNotifications(data);
          setError(null);
        }
      } catch (error) {
        console.error("Error loading notifications:", error);

        if (isMounted) {
          setError("Error loading notifications. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationsAsRead([notificationId]);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Unable to mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter((notification) => !notification.isRead)
      .map((notification) => notification._id);

    if (unreadIds.length === 0) return;

    try {
      await markNotificationsAsRead(unreadIds);

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setError("Unable to mark all notifications as read.");
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
      case "HIGH":
        return "badge-emergency";
      case "WARNING":
      case "MEDIUM":
        return "badge-high";
      default:
        return "badge-open";
    }
  };

  const pageTitle = isTenant
    ? "My Notifications"
    : isManager
      ? "Property Notifications"
      : isAdmin
        ? "System Notifications"
        : "Notification Center";

  const pageDescription = isTenant
    ? "Updates about your maintenance requests, technician assignments, and repairs."
    : isManager
      ? "Property maintenance alerts, technician assignments, escalations, and operational updates."
      : "System-wide maintenance alerts and operational updates.";

  const emptyTitle = isTenant
    ? "No Updates Yet"
    : "No Notifications Yet";

  const emptyDescription = isTenant
    ? "Updates about your maintenance requests will appear here."
    : isManager
      ? "You are all caught up with your property maintenance alerts."
      : "You are all caught up with your system notifications.";

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (error && notifications.length === 0) {
    return <div className="alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">{pageTitle}</h1>
          <p className="page-header-subtitle">{pageDescription}</p>
        </div>

        <div className="page-header-actions">
          <span
            className={`badge ${
              unreadCount > 0 ? "badge-high" : "badge-neutral"
            }`}
            style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}
          >
            {unreadCount} Unread Notification
            {unreadCount !== 1 ? "s" : ""}
          </span>

          {unreadCount > 0 && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleMarkAllAsRead}
            >
              ✓ Mark all as read
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {notifications.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🔔</span>
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
          }}
        >
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="card"
              style={{
                borderLeft: !notification.isRead
                  ? "4px solid var(--primary)"
                  : "4px solid var(--border)",
                background: !notification.isRead
                  ? "#ffffff"
                  : "var(--bg-card-subtle)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.35rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.05rem",
                      fontWeight: 600,
                    }}
                  >
                    {notification.title}
                  </h3>

                  {!notification.isRead && (
                    <span
                      className="badge badge-open"
                      style={{
                        fontSize: "0.65rem",
                        padding: "0.15rem 0.5rem",
                      }}
                    >
                      New
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    className={`badge ${getSeverityBadgeClass(
                      notification.severity
                    )}`}
                  >
                    {notification.severity}
                  </span>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p
                style={{
                  color: "var(--text-body)",
                  fontSize: "0.9rem",
                  margin: "0.25rem 0 0.85rem 0",
                }}
              >
                {notification.message}
              </p>

              {!notification.isRead && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    Mark as read
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Operational alert preferences are for managers/admins only. */}
      {!isTenant && <NotificationPreferences />}
    </div>
  );
};

export default NotificationPage;
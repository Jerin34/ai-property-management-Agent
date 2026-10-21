import { useEffect, useState } from "react";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../api/notification_preferences.api";
import type { NotificationPreferences as NotificationPreferencesType } from "../types/notificatio-preferences.types";

const NotificationPreferences = () => {
  const [preferences, setPreferences] =
    useState<NotificationPreferencesType | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPreferences = async () => {
      try {
        const data = await getNotificationPreferences();
        if (isMounted) {
          setPreferences(data);
          setError(null);
        }
      } catch (error) {
        console.error("Error loading notification preferences:", error);
        if (isMounted) {
          setError("Error loading notification preferences");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = async (
    key:
      | "emergencyMaintenance"
      | "highPriorityUnresolved"
      | "lowPropertyHealth"
      | "maintenanceBacklog"
  ) => {
    if (!preferences) return;

    const newValue = !preferences[key];

    try {
      setSaving(true);
      const updatedPreferences = await updateNotificationPreferences({
        [key]: newValue,
      });
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      setError("Error updating notification preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ marginTop: "2rem" }}>
        <h3 className="card-title">Notification Alert Preferences</h3>
        <p style={{ color: "var(--text-muted)" }}>Loading preferences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ marginTop: "2rem" }}>
        <h3 className="card-title">Notification Alert Preferences</h3>
        <div className="alert-error">{error}</div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="card" style={{ marginTop: "2rem" }}>
        <h3 className="card-title">Notification Alert Preferences</h3>
        <p style={{ color: "var(--text-muted)" }}>No notification preferences found.</p>
      </div>
    );
  }

  const preferenceItems = [
    {
      key: "emergencyMaintenance" as const,
      label: "Emergency Maintenance Alerts",
      description: "Receive instant notifications when critical or emergency requests are submitted.",
    },
    {
      key: "highPriorityUnresolved" as const,
      label: "High Priority Unresolved",
      description: "Alert when high-priority tasks exceed standard resolution thresholds.",
    },
    {
      key: "lowPropertyHealth" as const,
      label: "Low Property Health Scores",
      description: "Receive AI alerts when any property dips below a healthy risk score.",
    },
    {
      key: "maintenanceBacklog" as const,
      label: "Maintenance Backlog Surges",
      description: "Get notified when open work orders exceed recommended team capacity.",
    },
  ];

  return (
    <div className="card" style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h3 className="card-title" style={{ margin: 0 }}>
            Notification Alert Preferences
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
            Customize your automated alerts and AI incident monitoring channels.
          </p>
        </div>
        {saving && <span className="badge badge-neutral">Saving changes...</span>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {preferenceItems.map((item) => (
          <label
            key={item.key}
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              background: "var(--bg-card-subtle)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              cursor: saving ? "not-allowed" : "pointer",
              transition: "border-color 0.15s ease",
            }}
          >
            <div style={{ paddingRight: "1rem" }}>
              <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-main)", display: "block" }}>
                {item.label}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {item.description}
              </span>
            </div>
            <input
              type="checkbox"
              checked={preferences[item.key]}
              onChange={() => handleChange(item.key)}
              disabled={saving}
              style={{
                width: "20px",
                height: "20px",
                cursor: saving ? "not-allowed" : "pointer",
                accentColor: "var(--primary)",
                marginTop: "2px",
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default NotificationPreferences;
import { useEffect, useState } from "react";
import {
    getNotificationPreferences,
    updateNotificationPreferences
} from "../api/notification_preferences.api";
import type {
    NotificationPreferences as NotificationPreferencesType
} from "../types/notificatio-preferences.types";

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
                console.error(
                    "Error loading notification preferences:",
                    error
                );

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
        if (!preferences) {
            return;
        }

        const newValue = !preferences[key];

        try {
            setSaving(true);

            const updatedPreferences =
                await updateNotificationPreferences({
                    [key]: newValue
                });

            setPreferences(updatedPreferences);
        } catch (error) {
            console.error(
                "Error updating notification preferences:",
                error
            );

            setError("Error updating notification preferences");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p>Loading notification preferences...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!preferences) {
        return <p>No notification preferences found.</p>;
    }

    return (
        <div>
            <h2>Notification Preferences</h2>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.emergencyMaintenance}
                        onChange={() =>
                            handleChange("emergencyMaintenance")
                        }
                        disabled={saving}
                    />
                    Emergency Maintenance
                </label>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.highPriorityUnresolved}
                        onChange={() =>
                            handleChange("highPriorityUnresolved")
                        }
                        disabled={saving}
                    />
                    High Priority Unresolved
                </label>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.lowPropertyHealth}
                        onChange={() =>
                            handleChange("lowPropertyHealth")
                        }
                        disabled={saving}
                    />
                    Low Property Health
                </label>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.maintenanceBacklog}
                        onChange={() =>
                            handleChange("maintenanceBacklog")
                        }
                        disabled={saving}
                    />
                    Maintenance Backlog
                </label>
            </div>

            {saving && <p>Saving...</p>}
        </div>
    );
};

export default NotificationPreferences;
    import { useEffect, useState } from "react";
import {
    getNotifications,
    markNotificationsAsRead
} from "../api/notification.api";
import type { Notification } from "../types/notification.types";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadNotifications = async () => {
            try {
                const data = await getNotifications();

                if (isMounted) {
                    setNotifications(data);
                    setError(null);
                }
            } catch (error) {
                console.error("Error loading notifications:", error);

                if (isMounted) {
                    setError("Error loading notifications");
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
                        ? {
                              ...notification,
                              isRead: true
                          }
                        : notification
                )
            );
        } catch (error) {
            console.error(
                "Error marking notification as read:",
                error
            );
        }
    };

    const handleMarkAllAsRead = async () => {
        const unreadIds = notifications
            .filter((notification) => !notification.isRead)
            .map((notification) => notification._id);

        if (unreadIds.length === 0) {
            return;
        }

        try {
            await markNotificationsAsRead(unreadIds);

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );
        } catch (error) {
            console.error(
                "Error marking all notifications as read:",
                error
            );

            setError("Error marking all notifications as read");
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    if (loading) {
        return <p>Loading notifications...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <div>
                <h1>Notifications</h1>

                <p>
                    {unreadCount} unread notification
                    {unreadCount !== 1 ? "s" : ""}
                </p>

                {unreadCount > 0 && (
                    <button onClick={handleMarkAllAsRead}>
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                <div>
                    {notifications.map((notification) => (
                        <div key={notification._id}>
                            <h3>{notification.title}</h3>

                            <p>{notification.message}</p>

                            <p>
                                <strong>Severity:</strong>{" "}
                                {notification.severity}
                            </p>

                            <p>
                                {new Date(
                                    notification.createdAt
                                ).toLocaleDateString()}
                            </p>

                            {!notification.isRead && (
                                <button
                                    onClick={() =>
                                        handleMarkAsRead(
                                            notification._id
                                        )
                                    }
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
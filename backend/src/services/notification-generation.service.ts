import Property from "../models/property.models.js";
import { MaintenanceAlertService } from "./maintenace-Alert_services.js";
import { createNotification } from "./notification.services.js";
import NotificationModel from "../models/notification.model.js";
import NotificationPreferenceModel from "../models/notification_preferences.model.js";


export const generateNotificationsFromAlerts = async () => {

    const alerts = await MaintenanceAlertService();

    const notifications = [];

    for (const alert of alerts) {

        const property = await Property.findById(alert.propertyId);

        if (!property) {
            continue;
        }

        const preferences =
            await NotificationPreferenceModel.findOne({
                user: property.manager
            });

        // If no preference document exists,
        // allow notifications by default.
        if (preferences) {

            let isEnabled = true;

            switch (alert.type) {

                case "EMERGENCY_MAINTENANCE":
                    isEnabled = preferences.emergencyMaintenance;
                    break;

                case "HIGH_PRIORITY_UNRESOLVED":
                    isEnabled = preferences.highPriorityUnresolved;
                    break;

                case "LOW_PROPERTY_HEALTH":
                    isEnabled = preferences.lowPropertyHealth;
                    break;

                case "MAINTENANCE_BACKLOG":
                    isEnabled = preferences.maintenanceBacklog;
                    break;
            }

            if (!isEnabled) {
                continue;
            }
        }

        // Prevent duplicate maintenance notifications
        if (alert.maintenanceId) {

            const existingNotification =
                await NotificationModel.findOne({
                    recipient: property.manager,

                    maintenanceId: alert.maintenanceId,
                    type: alert.type
                });

            if (existingNotification) {
                continue;
            }
        }else{
                const existingNotification =
        await NotificationModel.findOne({
            recipient: property.manager,
            propertyId: alert.propertyId,
            type: alert.type
        });

    if (existingNotification) {
        continue;
    }
        }

        const notification = await createNotification({
            recipient: property.manager.toString(),

            maintenanceId: alert.maintenanceId
                ? alert.maintenanceId.toString()
                : undefined,
                propertyId:alert.propertyId.toString(),
            type: alert.type,

            severity: alert.severity,

            title: alert.type.replaceAll("_", " "),

            message: alert.message,

            isRead: false
        });

        notifications.push(notification);
    }

    return notifications;
};
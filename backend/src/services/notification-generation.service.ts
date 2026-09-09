import Property from "../models/property.models.js";
import { MaintenanceAlertService } from "./maintenace-Alert_services.types.js";
import { createNotification } from "./notification.services.js";
import NotificationModel from "../models/notification.model.js";

export const generateNotificationsFromAlerts = async () => {

    const alerts = await MaintenanceAlertService();

    const notifications = [];

    for (const alert of alerts) {

        const property = await Property.findById(alert.propertyId);

        if (!property) {
            continue;
        }

        // Only maintenance-specific alerts can be checked
        // using maintenanceId.
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
        }

        const notification = await createNotification({
            recipient: property.manager.toString(),
            maintenanceId: alert.maintenanceId ? alert.maintenanceId.toString() : undefined,
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
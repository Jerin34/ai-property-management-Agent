import Maintaince from "../models/maintenance.model.js";
import { IMaintenanceEscaltion } from "../types/maintenance_escallation.types.js";
import NotificationModel from "../models/notification.model.js";
import Property from '../models/property.models.js'
import {
    createNotification
} from "./notification.services.js";
export const ProcessmaintenanceEscaltion =
    async (): Promise<IMaintenanceEscaltion[]> => {

    const now = new Date();

    const maintenanceReq = await Maintaince.find({
        status: {
            $in: ["OPEN", "IN_PROGRESS"]
        }
    });

    const escalations: IMaintenanceEscaltion[] = [];

    for (const maintenance of maintenanceReq) {

        if (!maintenance.createdAt) {
            continue;
        }

        const ageInHours =
            (now.getTime() - maintenance.createdAt.getTime())
            / (1000 * 60 * 60);

        let escalationLevel:
            "NONE" | "HIGH" | "CRITICAL" = "NONE";

        let reasons = "";

        if (
            maintenance.priority === "EMERGENCY" &&
            ageInHours >= 1
        ) {
            escalationLevel = "CRITICAL";

            reasons =
                "Emergency maintenance request has been open for more than 1 hour.";
        }

        else if (
            maintenance.priority === "HIGH" &&
            ageInHours >= 24
        ) {
            escalationLevel = "HIGH";

            reasons =
                "High priority maintenance request has been open for more than 24 hours.";
        }

        else if (
            maintenance.priority === "MEDIUM" &&
            ageInHours >= 72
        ) {
            escalationLevel = "HIGH";

            reasons =
                "Medium priority maintenance request has been open for more than 3 days.";
        }

        else if (
            maintenance.priority === "LOW" &&
            ageInHours >= 168
        ) {
            escalationLevel = "HIGH";

            reasons =
                "Low priority maintenance request has been open for more than 7 days.";
        }

        if (escalationLevel === "NONE") {
            continue;
        }

        // Prevent duplicate escalation
        if (
            maintenance.esclationLevel &&
            maintenance.esclationLevel !== "NONE"
        ) {
            continue;
        }

        maintenance.esclationLevel = escalationLevel;
        maintenance.escaltedAt = now;

        await maintenance.save();
        const property = await Property.findById(
    maintenance.property
);

if (property) {

    const existingNotification =
        await NotificationModel.findOne({
            recipient: property.manager,
            maintenanceId: maintenance._id,
            type: "MAINTENANCE_ESCALATED"
        });

    if (!existingNotification) {

        await createNotification({
            recipient: property.manager.toString(),

            propertyId: maintenance.property.toString(),

            maintenanceId: maintenance._id.toString(),

            type: "MAINTENANCE_ESCALATED",

            severity:
                escalationLevel === "CRITICAL"
                    ? "CRITICAL"
                    : "HIGH",

            title: "MAINTENANCE ESCALATED",

            message: reasons,

            isRead: false
        });
    }
}

        escalations.push({
            maintenanceId: maintenance._id.toString(),
            propertyId: maintenance.property.toString(),
            escalationLevel,
            reasons
        });
    }

    return escalations;
};
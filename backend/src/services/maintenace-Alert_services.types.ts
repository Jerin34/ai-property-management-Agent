import Maintaince from "../models/maintenance.model.js";
import { PropertyHealthService } from "./property-health.services.js";
import { MaintenanceAlertType} from "../types/maintenance-alert.types.js";

export const MaintenanceAlertService = async (): Promise<MaintenanceAlertType[]> => {

    const maintenanceRequests = await Maintaince.find();

    const alerts: MaintenanceAlertType[] = [];

    for (const request of maintenanceRequests) {

        if (request.priority === "EMERGENCY") {
            alerts.push({
                propertyId: request.property.toString(),
                maintenanceId: request._id.toString(),
                type: "EMERGENCY_MAINTENANCE",
                severity: "CRITICAL",
                message: `Emergency ${request.category} maintenance request requires immediate attention`
            });
        }

        if (
            request.priority === "HIGH" &&
            (request.status === "OPEN" ||
             request.status === "IN_PROGRESS")
        ) {
            alerts.push({
                propertyId: request.property.toString(),
                maintenanceId: request._id.toString(),
                type: "HIGH_PRIORITY_UNRESOLVED",
                severity: "HIGH",
                message: `High priority ${request.category} maintenance request is unresolved`
            });
        }
    }

    const propertyIds = [
        ...new Set(
            maintenanceRequests.map(
                request => request.property.toString()
            )
        )
    ];

    for (const propertyId of propertyIds) {

        const health = await PropertyHealthService(propertyId);

        if (health.healthScore < 60) {
            alerts.push({
                propertyId,
                type: "LOW_PROPERTY_HEALTH",
                severity: "HIGH",
                message: `Property health score is ${health.healthScore}/100 with ${health.riskLevel} risk`
            });
        }

        if (health.openRequests >= 3) {
            alerts.push({
                propertyId,
                type: "MAINTENANCE_BACKLOG",
                severity: "MEDIUM",
                message: `Property has ${health.openRequests} unresolved maintenance requests`
            });
        }
    }

    return alerts;
};
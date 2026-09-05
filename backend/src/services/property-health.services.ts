import mongoose from "mongoose";
import Maintaince from "../models/maintenance.model.js";
import { PropertyHealthResult } from "../types/property-health.types.js";

export const PropertyHealthService = async (
    propertyId: string
): Promise<PropertyHealthResult> => {

    const maintenanceRequests = await Maintaince.find({
        property: new mongoose.Types.ObjectId(propertyId)
    });

    let healthScore = 100;

    let highPriorityRequests = 0;
    let emergencyRequests = 0;
    let openRequests = 0;

    const reasons: string[] = [];

    for (const request of maintenanceRequests) {

        if (request.priority === "HIGH") {
            healthScore -= 10;
            highPriorityRequests++;
        }

        if (request.priority === "EMERGENCY") {
            healthScore -= 20;
            emergencyRequests++;
        }

        if (
            request.status === "OPEN" ||
            request.status === "IN_PROGRESS"
        ) {
            healthScore -= 5;
            openRequests++;
        }
    }

    if (maintenanceRequests.length >= 3) {
        healthScore -= 15;
        reasons.push(
            `${maintenanceRequests.length} maintenance requests recorded`
        );
    }

    if (highPriorityRequests > 0) {
        reasons.push(
            `${highPriorityRequests} high priority request(s)`
        );
    }

    if (emergencyRequests > 0) {
        reasons.push(
            `${emergencyRequests} emergency request(s)`
        );
    }

    if (openRequests > 0) {
        reasons.push(
            `${openRequests} unresolved request(s)`
        );
    }

    healthScore = Math.max(0, Math.min(healthScore, 100));

    let riskLevel: string;

    if (healthScore >= 80) {
        riskLevel = "LOW";
    } else if (healthScore >= 60) {
        riskLevel = "MEDIUM";
    } else if (healthScore >= 40) {
        riskLevel = "HIGH";
    } else {
        riskLevel = "CRITICAL";
    }

    return {
        propertyId,
        healthScore,
        riskLevel,
        totalRequests: maintenanceRequests.length,
        highPriorityRequests,
        emergencyRequests,
        openRequests,
        reasons
    };
};
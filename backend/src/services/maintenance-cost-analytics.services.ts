
import Maintaince from "../models/maintenance.model.js";
import Property from "../models/property.models.js";
import { MaintenanceCostAnalytics } from "../types/maintenance_cost_analytics.types.js";

export const getMaintenanceCostAnalytics = async (
    userId: string,
    role: string
): Promise<MaintenanceCostAnalytics> => {

    // Allow only administrators and managers
    if (role !== "ADMIN" && role !== "MANAGER") {
        throw new Error("Unauthorized role for cost analytics");
    }

    // 1. Fetch all properties for ADMIN, or only owned properties for MANAGER
    const properties =
        role === "ADMIN"
            ? await Property.find()
            : await Property.find({ manager: userId });

    const managedPropertyIds = properties.map(
        (property) => property._id
    );

    // 2. Fetch maintenance requests within the user's authorized scope
    const maintenanceRequests =
        role === "ADMIN"
            ? await Maintaince.find()
            : await Maintaince.find({
                property: { $in: managedPropertyIds }
            });

    let totalEstimatedCost = 0;
    let totalActualCost = 0;
    let totalLaborCost = 0;
    let totalMaterialCost = 0;

    const categoryCosts: Record<string, number> = {};

    let mostExpensiveRequest:
        MaintenanceCostAnalytics["mostExpensiveRequest"] = null;

    // 3. Calculate total costs, category costs, and the most expensive request
    for (const request of maintenanceRequests) {
        const estimatedCost = request.estimatedCost ?? 0;
        const actualCost = request.actualCost ?? 0;
        const laborCost = request.laborCost ?? 0;
        const materialCost = request.materialCost ?? 0;

        totalEstimatedCost += estimatedCost;
        totalActualCost += actualCost;
        totalLaborCost += laborCost;
        totalMaterialCost += materialCost;

        categoryCosts[request.category] =
            (categoryCosts[request.category] ?? 0) + actualCost;

        if (
            actualCost > 0 &&
            (!mostExpensiveRequest ||
                actualCost > mostExpensiveRequest.actualCost)
        ) {
            mostExpensiveRequest = {
                maintenanceId: request._id.toString(),
                title: request.title,
                actualCost
            };
        }
    }

    // 4. Calculate average actual cost per request that has an actual cost
    const requestsWithActualCost = maintenanceRequests.filter(
        (request) => (request.actualCost ?? 0) > 0
    ).length;

    const averageActualCost =
        requestsWithActualCost > 0
            ? totalActualCost / requestsWithActualCost
            : 0;

    // 5. Calculate actual cost per property
    const propertyCosts: Record<string, number> = {};

    for (const request of maintenanceRequests) {
        const propertyId = request.property.toString();
        const actualCost = request.actualCost ?? 0;

        propertyCosts[propertyId] =
            (propertyCosts[propertyId] ?? 0) + actualCost;
    }

    // Reuse the already-authorized properties; do not fetch other managers' properties
    const byProperty = properties
        .filter((property) =>
            Object.prototype.hasOwnProperty.call(
                propertyCosts,
                property._id.toString()
            )
        )
        .map((property) => ({
            propertyId: property._id.toString(),
            propertyName: property.name.toString(),
            actualCost: propertyCosts[property._id.toString()] ?? 0
        }));

    // 6. Return analytics for the authorized scope only
    return {
        totalEstimatedCost,
        totalActualCost,
        totalLaborCost,
        totalMaterialCost,
        costVariance: totalEstimatedCost - totalActualCost,
        averageActualCost,
        mostExpensiveRequest,
        byCategory: categoryCosts,
        byProperty
    };
};
    
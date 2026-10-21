import Maintaince from "../models/maintenance.model.js";
import Property from "../models/property.models.js";
import { MaintenanceCostAnalytics } from "../types/maintenance_cost_analytics.types.js";
import { ROLES, type Role } from "../constants/roles.js";

export const getMaintenanceCostAnalytics = async (
    userId: string,
    role: Role
): Promise<MaintenanceCostAnalytics> => {
    // Scope both the requests and property lookup to the authenticated manager.
    const properties = role === ROLES.Admin
        ? await Property.find()
        : await Property.find({ manager: userId });

    const propertyIds = properties.map(property => property._id);

    const maintenanceRequests = role === ROLES.Admin
        ? await Maintaince.find()
        : await Maintaince.find({ property: { $in: propertyIds } });

    let totalEstimatedCost = 0;
    let totalActualCost = 0;
    let totalLaborCost = 0;
    let totalMaterialCost = 0;

    const categoryCosts: Record<string, number> = {};
    let mostExpensiveRequest: MaintenanceCostAnalytics["mostExpensiveRequest"] = null;

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
            (!mostExpensiveRequest || actualCost > mostExpensiveRequest.actualCost)
        ) {
            mostExpensiveRequest = {
                maintenanceId: request._id.toString(),
                title: request.title,
                actualCost
            };
        }
    }

    const requestsWithActualCost = maintenanceRequests.filter(
        request => (request.actualCost ?? 0) > 0
    ).length;

    const averageActualCost = requestsWithActualCost > 0
        ? totalActualCost / requestsWithActualCost
        : 0;

    const propertyCosts: Record<string, number> = {};

    for (const request of maintenanceRequests) {
        const propertyId = request.property.toString();
        propertyCosts[propertyId] =
            (propertyCosts[propertyId] ?? 0) + (request.actualCost ?? 0);
    }

    const propertyIdsWithCosts = Object.keys(propertyCosts);

    const propertiesWithCosts = properties.filter(property =>
        propertyIdsWithCosts.includes(property._id.toString())
    );

    const byProperty = propertiesWithCosts.map(property => ({
        propertyId: property._id.toString(),
        propertyName: property.name.toString(),
        actualCost: propertyCosts[property._id.toString()] ?? 0
    }));

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

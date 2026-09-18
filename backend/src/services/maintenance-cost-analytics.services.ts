import Maintaince from "../models/maintenance.model.js";
import Property from "../models/property.models.js";
import { MaintenanceCostAnalytics } from "../types/maintenance_cost_analytics.types.js";


export const getMaintenanceCostAnalytics =
    async (): Promise<MaintenanceCostAnalytics> => {

    const maintenanceRequests = await Maintaince.find();

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

        // Category cost
        categoryCosts[request.category] =
            (categoryCosts[request.category] ?? 0) + actualCost;

        // Most expensive request
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

    const requestsWithActualCost =
        maintenanceRequests.filter(
            request => (request.actualCost ?? 0) > 0
        ).length;

    const averageActualCost =
        requestsWithActualCost > 0
            ? totalActualCost / requestsWithActualCost
            : 0;

    // Property cost calculation
    const propertyCosts: Record<string, number> = {};

    for (const request of maintenanceRequests) {

        const propertyId = request.property.toString();
        const actualCost = request.actualCost ?? 0;

        propertyCosts[propertyId] =
            (propertyCosts[propertyId] ?? 0) + actualCost;
    }

    const propertyIds = Object.keys(propertyCosts);

    const properties = await Property.find({
        _id: { $in: propertyIds }
    });

    const byProperty = properties.map(property => ({
        propertyId: property._id.toString(),
        propertyName: property.name.toString(),
        actualCost: propertyCosts[property._id.toString()] ?? 0
    }));

    return {
        totalEstimatedCost,
        totalActualCost,
        totalLaborCost,
        totalMaterialCost,

        costVariance:
            totalEstimatedCost - totalActualCost,

        averageActualCost,

        mostExpensiveRequest,

        byCategory: categoryCosts,

        byProperty
    };
};
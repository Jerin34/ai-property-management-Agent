import Maintaince from "../models/maintenance.model.js";
import { MAINTENANCE_PRIORITY,MAINTENANCE_STATUS } from "../constants/maintenance.js";
import { MaintenanceSLAMetrics } from '../types/maintenance_sla.types.js'
const SLA_HOURS: Record<string, number> = {
    [MAINTENANCE_PRIORITY.Low]: 168,
    [MAINTENANCE_PRIORITY.Medium]: 72,
    [MAINTENANCE_PRIORITY.High]: 24,
    [MAINTENANCE_PRIORITY.Emergency]: 1
};

export const getMaintenanceSLAMetrics =
    async (): Promise<MaintenanceSLAMetrics> => {

    const maintenanceRequests = await Maintaince.find();

    const totalRequests = maintenanceRequests.length;

    const completedRequests = maintenanceRequests.filter(
        request => request.status === MAINTENANCE_STATUS.COMPLETED
    ).length;

    let breachedRequests = 0;
    let totalResolutionTime = 0;
    let resolvedRequestCount = 0;

    const priorityStats: Record<
        string,
        {
            totalRequests: number;
            breachedRequests: number;
        }
    > = {};

    for (const request of maintenanceRequests) {

        const priority = request.priority;

        if (!priorityStats[priority]) {
            priorityStats[priority] = {
                totalRequests: 0,
                breachedRequests: 0
            };
        }

        priorityStats[priority].totalRequests++;

        if (!request.createdAt) {
            continue;
        }

        const endTime =
            request.status === MAINTENANCE_STATUS.COMPLETED &&
            request.updatedAt
                ? request.updatedAt
                : new Date();

        const durationHours =
            (endTime.getTime() - request.createdAt.getTime())
            / (1000 * 60 * 60);

        const slaHours = SLA_HOURS[priority];

        if (slaHours !== undefined && durationHours > slaHours) {

            breachedRequests++;

            priorityStats[priority].breachedRequests++;
        }

        if (
            request.status === MAINTENANCE_STATUS.COMPLETED &&
            request.updatedAt
        ) {
            totalResolutionTime += durationHours;
            resolvedRequestCount++;
        }
    }

    const complianceRate =
        totalRequests > 0
            ? ((totalRequests - breachedRequests) / totalRequests) * 100
            : 100;

    const averageResolutionTimeHours =
        resolvedRequestCount > 0
            ? totalResolutionTime / resolvedRequestCount
            : 0;

    const byPriority = Object.entries(priorityStats).map(
        ([priority, stats]) => {

            const complianceRate =
                stats.totalRequests > 0
                    ? (
                        (stats.totalRequests - stats.breachedRequests)
                        / stats.totalRequests
                    ) * 100
                    : 100;

            return {
                priority,
                totalRequests: stats.totalRequests,
                breachedRequests: stats.breachedRequests,
                complianceRate
            };
        }
    );

    return {
        totalRequests,
        completedRequests,
        breachedRequests,
        complianceRate,
        averageResolutionTimeHours,
        byPriority
    };
};


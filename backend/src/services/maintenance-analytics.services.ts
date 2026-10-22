
import Property from '../models/property.models.js';
import Maintaince from '../models/maintenance.model.js';
import User from '../models/user.model.js';

import { MaintenanceAnalytics } from '../types/maintenance-analytics.types.js';

import { MAINTENANCE_STATUS } from '../constants/maintenance.js';

export const getMaintenanceAnalytics = async (
    userId: string,
    role: string
): Promise<MaintenanceAnalytics> => {

    // 1. Get properties the user is authorized to access
    if (role !== 'ADMIN' && role !== 'MANAGER') {
        throw new Error('Unauthorized role for maintenance analytics');
    }

    const properties =
        role === 'ADMIN'
            ? await Property.find()
            : await Property.find({ manager: userId });

    // 2. Get maintenance requests for those properties
    const propertyIds = properties.map(property => property._id);

    const maintenaceRequests =
        role === 'ADMIN'
            ? await Maintaince.find()
            : await Maintaince.find({
                property: { $in: propertyIds }
            });

    // 3. Overview
    const totalRequests = maintenaceRequests.length;

    const openRequests = maintenaceRequests.filter(
        request => request.status === MAINTENANCE_STATUS.Open
    ).length;

    const inProgressRequests = maintenaceRequests.filter(
        request => request.status === MAINTENANCE_STATUS.InProgress
    ).length;

    const completedRequests = maintenaceRequests.filter(
        request => request.status === MAINTENANCE_STATUS.COMPLETED
    ).length;

    // 4. Requests by priority
    const byPriority = {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        EMERGENCY: 0
    };

    for (const request of maintenaceRequests) {
        if (request.priority in byPriority) {
            byPriority[
                request.priority as keyof typeof byPriority
            ]++;
        }
    }

    // 5. Requests by category
    const byCategory = {
        PLUMBING: 0,
        ELECTRICAL: 0,
        HVAC: 0,
        APPLIANCE: 0,
        STRUCTURAL: 0,
        OTHER: 0
    };

    for (const request of maintenaceRequests) {
        if (request.category in byCategory) {
            byCategory[
                request.category as keyof typeof byCategory
            ]++;
        }
    }

    // 6. Average resolution time
    const completedWithDates = maintenaceRequests.filter(
        request =>
            request.status === MAINTENANCE_STATUS.COMPLETED &&
            request.createdAt &&
            request.updatedAt
    );

    let averageResolutionTimeHours = 0;

    if (completedWithDates.length > 0) {
        const totalResolutionTime = completedWithDates.reduce(
            (total, request) =>
                total +
                (
                    request.updatedAt!.getTime() -
                    request.createdAt!.getTime()
                ),
            0
        );

        averageResolutionTimeHours = Number(
            (
                totalResolutionTime /
                completedWithDates.length /
                (1000 * 60 * 60)
            ).toFixed(2)
        );
    }

    // 7. Technician workload
    // Include technicians assigned to the filtered requests only.
    const assignedTechnicianIds = [
        ...new Set(
            maintenaceRequests
                .filter(request => request.technician)
                .map(request => request.technician.toString())
        )
    ];

    const technicians = assignedTechnicianIds.length > 0
        ? await User.find({
            _id: { $in: assignedTechnicianIds },
            role: 'TECHNICIAN',
            isActive: true
        })
        : [];

    const technicianWorkload = technicians.map(technician => {
        const technicianRequests = maintenaceRequests.filter(
            request =>
                request.technician?.toString() ===
                technician._id.toString()
        );

        return {
            technicianId: technician._id.toString(),
            technicianName: technician.name,
            totalRequests: technicianRequests.length,
            inProgressRequests: technicianRequests.filter(
                request =>
                    request.status === MAINTENANCE_STATUS.InProgress
            ).length,
            completedRequests: technicianRequests.filter(
                request =>
                    request.status === MAINTENANCE_STATUS.COMPLETED
            ).length
        };
    });

    // 8. Property issues
    const propertyIssues = properties
        .map(property => {
            const requestCount = maintenaceRequests.filter(
                request =>
                    request.property.toString() ===
                    property._id.toString()
            ).length;

            return {
                propertyId: property._id.toString(),
                propertyName: property.name.toString(),
                requestCount
            };
        })
        .filter(property => property.requestCount > 0)
        .sort((a, b) => b.requestCount - a.requestCount);

    // 9. Return analytics
    return {
        overview: {
            totalRequests,
            openRequests,
            inProgressRequests,
            completedRequests
        },
        byPriority,
        byCategory,
        technicianWorkload,
        resolutionMetrics: {
            averageResolutionTimeHours
        },
        propertyIssues
    };
};

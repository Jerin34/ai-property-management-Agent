import Property from '../models/property.models.js'
import Maintaince from '../models/maintenance.model.js'
import User from '../models/user.model.js'

import { MaintenanceAnalytics } from '../types/maintenance-analytics.types.js'

import {
    MAINTENANCE_STATUS
} from '../constants/maintenance.js'


export const getMaintenanceAnalytics =
    async (): Promise<MaintenanceAnalytics> => {

    const maintenaceRequests =
        await Maintaince.find();


    // --------------------------------------------------
    // OVERVIEW
    // --------------------------------------------------

    const totalRequests =
        maintenaceRequests.length;

    const openRequests =
        maintenaceRequests.filter(
            request =>
                request.status === MAINTENANCE_STATUS.Open
        ).length;

    const inProgressRequests =
        maintenaceRequests.filter(
            request =>
                request.status === MAINTENANCE_STATUS.InProgress
        ).length;

    const completedRequests =
        maintenaceRequests.filter(
            request =>
                request.status === MAINTENANCE_STATUS.COMPLETED
        ).length;


    // --------------------------------------------------
    // PRIORITY
    // --------------------------------------------------

    const byPriority = {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        EMERGENCY: 0,
    };

    for (const request of maintenaceRequests) {

        if (request.priority in byPriority) {

            byPriority[
                request.priority as keyof typeof byPriority
            ]++;
        }
    }


    // --------------------------------------------------
    // CATEGORY
    // --------------------------------------------------

    const byCategory = {
        PLUMBING: 0,
        ELECTRICAL: 0,
        HVAC: 0,
        APPLIANCE: 0,
        STRUCTURAL: 0,
        OTHER: 0,
    };

    for (const request of maintenaceRequests) {

        if (request.category in byCategory) {

            byCategory[
                request.category as keyof typeof byCategory
            ]++;
        }
    }


    // --------------------------------------------------
    // RESOLUTION TIME
    // --------------------------------------------------

    const completedwithDates =
        maintenaceRequests.filter(
            request =>
                request.status === MAINTENANCE_STATUS.COMPLETED &&
                request.createdAt &&
                request.updatedAt
        );

    let averageResolutionTimeHours = 0;

    if (completedwithDates.length > 0) {

        let totalResolutionTime = 0;

        for (const request of completedwithDates) {

            const resolutionTime =
                request.updatedAt!.getTime() -
                request.createdAt!.getTime();

            totalResolutionTime += resolutionTime;
        }

        averageResolutionTimeHours =
            totalResolutionTime /
            completedwithDates.length /
            (1000 * 60 * 60);

        averageResolutionTimeHours =
            Number(
                averageResolutionTimeHours.toFixed(2)
            );
    }


    // --------------------------------------------------
    // TECHNICIAN WORKLOAD
    // --------------------------------------------------

    const technician =
        await User.find({
            role: "TECHNICIAN",
            isActive: true
        });

    const technicianWorkload =
        technician.map(technician => {

            const technicianRequest =
                maintenaceRequests.filter(
                    request =>
                        request.technician &&
                        request.technician.toString() ===
                        technician._id.toString()
                );

            const totalRequests =
                technicianRequest.length;

            const inProgressRequests =
                technicianRequest.filter(
                    request =>
                        request.status ===
                        MAINTENANCE_STATUS.InProgress
                ).length;

            const completedRequests =
                technicianRequest.filter(
                    request =>
                        request.status ===
                        MAINTENANCE_STATUS.COMPLETED
                ).length;

            return {
                technicianId:
                    technician._id.toString(),

                technicianName:
                    technician.name,

                totalRequests,

                inProgressRequests,

                completedRequests
            };
        });


    // --------------------------------------------------
    // PROPERTY ISSUES
    // --------------------------------------------------

    const properties =
        await Property.find();

    const propertyIssues =
        properties
            .map(property => {

                const requestCount =
                    maintenaceRequests.filter(
                        request =>
                            request.property.toString() ===
                            property._id.toString()
                    ).length;

                return {
                    propertyId:
                        property._id.toString(),

                    propertyName:
                        property.name.toString(),

                    requestCount
                };
            })
            .filter(
                property =>
                    property.requestCount > 0
            )
            .sort(
                (a, b) =>
                    b.requestCount -
                    a.requestCount
            );


    // --------------------------------------------------
    // FINAL RESULT
    // --------------------------------------------------

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
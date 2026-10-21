import Property from '../models/property.models.js'
import Maintaince from '../models/maintenance.model.js'
import User from '../models/user.model.js'
import { MaintenanceAnalytics } from '../types/maintenance-analytics.types.js'
import { MAINTENANCE_STATUS } from '../constants/maintenance.js'
import { ROLES, type Role } from '../constants/roles.js'

export const getMaintenanceAnalytics = async (
    userId: string,
    role: Role
): Promise<MaintenanceAnalytics> => {
    // Admins can view the whole portfolio. Managers are restricted to
    // maintenance requests belonging to properties assigned to their account.
    const properties = role === ROLES.Admin
        ? await Property.find()
        : await Property.find({ manager: userId })

    const propertyIds = properties.map(property => property._id)

    const maintenaceRequests = role === ROLES.Admin
        ? await Maintaince.find()
        : await Maintaince.find({ property: { $in: propertyIds } })

    const totalRequests = maintenaceRequests.length

    const openRequests = maintenaceRequests.filter(
        request => request.status === MAINTENANCE_STATUS.Open
    ).length

    const inProgressRequests = maintenaceRequests.filter(
        request => request.status === MAINTENANCE_STATUS.InProgress
    ).length

    const completedRequests = maintenaceRequests.filter(
        request => request.status === MAINTENANCE_STATUS.COMPLETED
    ).length

    const byPriority = {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        EMERGENCY: 0,
    }

    for (const request of maintenaceRequests) {
        if (request.priority in byPriority) {
            byPriority[request.priority as keyof typeof byPriority]++
        }
    }

    const byCategory = {
        PLUMBING: 0,
        ELECTRICAL: 0,
        HVAC: 0,
        APPLIANCE: 0,
        STRUCTURAL: 0,
        OTHER: 0,
    }

    for (const request of maintenaceRequests) {
        if (request.category in byCategory) {
            byCategory[request.category as keyof typeof byCategory]++
        }
    }

    const completedwithDates = maintenaceRequests.filter(
        request =>
            request.status === MAINTENANCE_STATUS.COMPLETED &&
            request.createdAt &&
            request.updatedAt
    )

    let averageResolutionTimeHours = 0

    if (completedwithDates.length > 0) {
        let totalResolutionTime = 0

        for (const request of completedwithDates) {
            const resolutionTime =
                request.updatedAt!.getTime() - request.createdAt!.getTime()
            totalResolutionTime += resolutionTime
        }

        averageResolutionTimeHours = Number(
            (totalResolutionTime / completedwithDates.length / (1000 * 60 * 60)).toFixed(2)
        )
    }

    // For managers, only include technicians who have requests in their portfolio.
    const technicianIds = [
        ...new Set(
            maintenaceRequests
                .filter(request => request.technician)
                .map(request => request.technician!.toString())
        )
    ]

    const technicianFilter: Record<string, unknown> = {
        role: ROLES.Technician,
        isActive: true
    }

    if (role !== ROLES.Admin) {
        technicianFilter._id = { $in: technicianIds }
    }

    const technicians = await User.find(technicianFilter)

    const technicianWorkload = technicians.map(technician => {
        const technicianRequest = maintenaceRequests.filter(
            request =>
                request.technician &&
                request.technician.toString() === technician._id.toString()
        )

        return {
            technicianId: technician._id.toString(),
            technicianName: technician.name,
            totalRequests: technicianRequest.length,
            inProgressRequests: technicianRequest.filter(
                request => request.status === MAINTENANCE_STATUS.InProgress
            ).length,
            completedRequests: technicianRequest.filter(
                request => request.status === MAINTENANCE_STATUS.COMPLETED
            ).length
        }
    })

    const propertyIssues = properties
        .map(property => {
            const requestCount = maintenaceRequests.filter(
                request => request.property.toString() === property._id.toString()
            ).length

            return {
                propertyId: property._id.toString(),
                propertyName: property.name.toString(),
                requestCount
            }
        })
        .filter(property => property.requestCount > 0)
        .sort((a, b) => b.requestCount - a.requestCount)

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
    }
}

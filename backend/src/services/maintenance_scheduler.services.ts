
import MaintenanceSchedule from "../models/maintenance_schedule.model.js";
import Property from "../models/property.models.js";
import { CreateMaintenanceScheduleInput } from "../validator/maintenance_scheduler.validator.js";

type UserRole = "ADMIN" | "MANAGER";

const validateRole = (role: string): UserRole => {
    if (role !== "ADMIN" && role !== "MANAGER") {
        throw new Error("Unauthorized role for maintenance schedules");
    }

    return role;
};

const getAuthorizedPropertyIds = async (
    userId: string,
    role: UserRole
) => {
    const properties =
        role === "ADMIN"
            ? await Property.find().select("_id")
            : await Property.find({ manager: userId }).select("_id");

    return properties.map((property) => property._id);
};

export const createMaintenanceSchedule = async (
    data: CreateMaintenanceScheduleInput,
    userId: string,
    role: string
) => {
    const authorizedRole = validateRole(role);

    const propertyIds = await getAuthorizedPropertyIds(
        userId,
        authorizedRole
    );

    const requestedPropertyId = String(data.property);

    const isAuthorized = propertyIds.some(
        (id) => id.toString() === requestedPropertyId
    );

    if (!isAuthorized) {
        throw new Error(
            "You are not authorized to create a schedule for this property"
        );
    }

    return MaintenanceSchedule.create(data);
};

export const getMaintenanceSchedule = async (
    userId: string,
    role: string,
    propertyId?: string
) => {
    const authorizedRole = validateRole(role);

    const propertyIds = await getAuthorizedPropertyIds(
        userId,
        authorizedRole
    );

    const query: Record<string, unknown> = {
        property: { $in: propertyIds }
    };

    if (propertyId) {
        const isAuthorized = propertyIds.some(
            (id) => id.toString() === propertyId
        );

        if (!isAuthorized) {
            throw new Error(
                "You are not authorized to access this property"
            );
        }

        query.property = propertyId;
    }

    return MaintenanceSchedule.find(query).sort({
        nextDueDate: -1
    });
};

export const getMaintenanceScheduleById = async (
    id: string,
    userId: string,
    role: string
) => {
    const authorizedRole = validateRole(role);

    const propertyIds = await getAuthorizedPropertyIds(
        userId,
        authorizedRole
    );

    return MaintenanceSchedule.findOne({
        _id: id,
        property: { $in: propertyIds }
    });
};

export const getMaintenaceDueSchedules = async (
    userId: string,
    role: string
) => {
    const authorizedRole = validateRole(role);

    const propertyIds = await getAuthorizedPropertyIds(
        userId,
        authorizedRole
    );

    const now = new Date();

    return MaintenanceSchedule.find({
        property: { $in: propertyIds },
        isActive: true,
        nextDueDate: { $lte: now }
    }).sort({ nextDueDate: -1 });
};


import MaintenanceSchedule from "../models/maintenance_schedule.model.js";
import Property from "../models/property.models.js";
import Maintaince from "../models/maintenance.model.js";
import {
    MAINTENANCE_STATUS,
    MAINTENANCE_PRIORITY
} from "../constants/maintenance.js";

// Shared processing logic.
// If propertyIds is provided, process only those properties.
// If omitted, process all properties (cron job only).
const processSchedules = async (propertyIds?: string[]) => {
    const now = new Date();

    const query: Record<string, any> = {
        isActive: true,
        nextDueDate: { $lte: now }
    };

    if (propertyIds !== undefined) {
        query.property = { $in: propertyIds };
    }

    const schedules = await MaintenanceSchedule.find(query);
    const createdMaintenances = [];

    for (const schedule of schedules) {
        const property = await Property.findById(schedule.property);

        if (!property) {
            continue;
        }

        const maintenance = await Maintaince.create({
            property: property._id,
            tenant: property.manager,
            title: schedule.title,
            description:
                schedule.description ||
                `Scheduled preventive maintenance for ${schedule.title}`,
            aiSummary:
                `Preventive maintenance scheduled for ${schedule.title}`,
            category: schedule.category,
            priority: MAINTENANCE_PRIORITY.Medium,
            status: MAINTENANCE_STATUS.Open
        });

        createdMaintenances.push(maintenance);

        const nextDueDate = new Date(schedule.nextDueDate);

        while (nextDueDate <= now) {
            switch (schedule.frequency) {
                case "DAILY":
                    nextDueDate.setDate(nextDueDate.getDate() + 1);
                    break;
                case "WEEKLY":
                    nextDueDate.setDate(nextDueDate.getDate() + 7);
                    break;
                case "MONTHLY":
                    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                    break;
                case "QUARTERLY":
                    nextDueDate.setMonth(nextDueDate.getMonth() + 3);
                    break;
                case "YEARLY":
                    nextDueDate.setFullYear(
                        nextDueDate.getFullYear() + 1
                    );
                    break;
                default:
                    throw new Error(
                        `Unsupported maintenance frequency: ${schedule.frequency}`
                    );
            }
        }

        schedule.nextDueDate = nextDueDate;
        await schedule.save();
    }

    return createdMaintenances;
};

// 1. Called by the authenticated API controller.
export const processDueMaintenanceSchedule = async (
    userId: string,
    role: string
) => {
    if (role !== "ADMIN" && role !== "MANAGER") {
        throw new Error("Unauthorized role for preventive maintenance");
    }

    const properties =
        role === "ADMIN"
            ? await Property.find().select("_id")
            : await Property.find({ manager: userId }).select("_id");

    const propertyIds = properties.map(
        (property) => property._id.toString()
    );

    return processSchedules(propertyIds);
};

// 2. Called only by the server's automatic cron job.
export const processDueMaintenanceScheduleSystem = async () => {
    return processSchedules();
};

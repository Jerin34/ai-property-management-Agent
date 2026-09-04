import mongoose from "mongoose";
import Maintaince from "../models/maintenance.model.js";
import { RecurringMaintenaceResult } from "../types/recurring.types.js";

export const detectRecurringMaintenace = async (
    propertyId: string,
    category: string
): Promise<RecurringMaintenaceResult> => {

    const periodDays = 60;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const result = await Maintaince.aggregate([
        {
            $match: {
                property: new mongoose.Types.ObjectId(propertyId),
                category,
                createdAt: {
                    $gte: startDate
                }
            }
        },
        {
            $count: "count"
        }
    ]);

    const requestCount = result.length > 0 ? result[0].count : 0;

    const isRecurring = requestCount >= 3;

    return {
        isRecurring,
        requestCount,
        propertyId,
        category,
        periodDays,
        message: isRecurring
            ? `Recurring ${category} maintenance issue detected`
            : `No recurring ${category} maintenance issue detected`
    };
};
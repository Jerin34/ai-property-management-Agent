import { Request, Response } from "express";
import { getMaintenanceCostAnalytics } from "../services/maintenance-cost-analytics.services.js";

export const maintenanceCostAnalytics = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const analytics = await getMaintenanceCostAnalytics();

        res.status(200).json({
            success: true,
            data: analytics
        });

    } catch (err) {

        console.error(
            "MAINTENANCE COST ANALYTICS ERROR:",
            err
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
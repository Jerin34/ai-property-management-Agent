import { Request, Response } from "express";
import { getMaintenanceAnalytics } from "../services/maintenance-analytics.services.js";

export const getAnalytics = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }

        const analytics = await getMaintenanceAnalytics(user.userId, user.role);

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (err) {
        console.error("MAINTENANCE ANALYTICS ERROR:", err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

import { Request, Response } from "express";
import { updateMaintenanceCost } from "../services/maintenance_cost.services.js";
import { updateMaintenanceCostSchema } from "../validator/maintenance_cost.validator.js";

export const updateCost = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const maintenanceId = req.params.id.toString();

        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication Required"
            });
            return;
        }

        const validatedData = updateMaintenanceCostSchema.parse(req.body);

        const maintenance = await updateMaintenanceCost(
            maintenanceId,
            req.user.userId,
            validatedData
        );

        res.status(200).json({
            success: true,
            data: maintenance
        });
    } catch (err) {
        console.log(err);

        if (
            err instanceof Error &&
            err.message === "Maintenance request not found"
        ) {
            res.status(404).json({
                success: false,
                message: "Maintenance request not found"
            });
            return;
        }

        if (
            err instanceof Error &&
            err.message === "You are not allowed to update this request"
        ) {
            res.status(403).json({
                success: false,
                message: err.message
            });
            return;
        }

        if (err instanceof Error && err.name === "ZodError") {
            res.status(400).json({
                success: false,
                message: "Invalid cost data"
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
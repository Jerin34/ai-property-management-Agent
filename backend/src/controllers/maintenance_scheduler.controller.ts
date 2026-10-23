
import type { Request, Response } from "express";
import { ZodError } from "zod";

import {
    createMaintenanceSchedule,
    getMaintenanceSchedule,
    getMaintenanceScheduleById,
    getMaintenaceDueSchedules
} from "../services/maintenance_scheduler.services.js";

import {
    processDueMaintenanceSchedule
} from "../services/preventive_maintenace.services.js";

import {
    createMaintenanceScheduleSchema
} from "../validator/maintenance_scheduler.validator.js";

export const createSchedule = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        const validateData = createMaintenanceScheduleSchema.parse(req.body);

        const schedule = await createMaintenanceSchedule(
            validateData,
            user.userId,
            user.role
        );

        res.status(201).json({
            success: true,
            data: schedule
        });
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: err.issues
            });
            return;
        }

        if (err instanceof Error && err.message.startsWith("Unauthorized")) {
            res.status(403).json({
                success: false,
                message: err.message
            });
            return;
        }

        console.error("Error creating maintenance schedule:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getSchedule = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        const propertyId =
            typeof req.query.propertyId === "string"
                ? req.query.propertyId
                : undefined;

        const schedules = await getMaintenanceSchedule(
            user.userId,
            user.role,
            propertyId
        );

        res.status(200).json({
            success: true,
            data: schedules
        });
    } catch (err) {
        if (err instanceof Error && err.message.startsWith("Unauthorized")) {
            res.status(403).json({
                success: false,
                message: err.message
            });
            return;
        }

        console.error("Error fetching maintenance schedules:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getScheduleById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        const scheduleId = req.params.id.toString();

        const schedule = await getMaintenanceScheduleById(
            scheduleId,
            user.userId,
            user.role
        );

        if (!schedule) {
            res.status(404).json({
                success: false,
                message: "Maintenance schedule not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: schedule
        });
    } catch (err) {
        if (err instanceof Error && err.message.startsWith("Unauthorized")) {
            res.status(403).json({
                success: false,
                message: err.message
            });
            return;
        }

        console.error("Error fetching maintenance schedule:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getDueSchedules = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        const schedules = await getMaintenaceDueSchedules(
            user.userId,
            user.role
        );

        res.status(200).json({
            success: true,
            data: schedules
        });
    } catch (err) {
        if (err instanceof Error && err.message.startsWith("Unauthorized")) {
            res.status(403).json({
                success: false,
                message: err.message
            });
            return;
        }

        console.error("Error fetching due schedules:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const processDueSchedules = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        const maintenances = await processDueMaintenanceSchedule(
            user.userId,
            user.role
        );

        res.status(200).json({
            success: true,
            count: maintenances.length,
            data: maintenances
        });
    } catch (err) {
        if (err instanceof Error && err.message.startsWith("Unauthorized")) {
            res.status(403).json({
                success: false,
                message: err.message
            });
            return;
        }

        console.error("Error processing due schedules:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

import type { NextFunction, Request, Response } from "express";
import MaintenanceDailyQuota from "../models/maintenance-daily-quota.model.js";

export const DAILY_MAINTENANCE_LIMIT = 20;

const COUNTER_RETENTION_MS = 48 * 60 * 60 * 1000;

export const maintenanceDailyQuotaLimiter = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const user = req.user;

    if (!user?.userId) {
        res.status(401).json({
            success: false,
            code: "AUTHENTICATION_REQUIRED",
            message: "Authentication is required.",
        });
        return;
    }

    // Quotas reset at 00:00 UTC. Use one stable key per tenant per UTC day.
    const now = new Date();
    const dateKey = now.toISOString().slice(0, 10);
    const nextUtcMidnight = new Date(`${dateKey}T00:00:00.000Z`);
    nextUtcMidnight.setUTCDate(nextUtcMidnight.getUTCDate() + 1);
    const retryAfterSeconds = Math.max(
        1,
        Math.ceil((nextUtcMidnight.getTime() - now.getTime()) / 1000),
    );

    try {
        /*
         * This is one atomic MongoDB update. Concurrent requests for the same
         * tenant/day cannot read the same old count and all pass the limit.
         * Denied attempts continue increasing the counter, so once exhausted
         * the quota cannot reopen until the next UTC day.
         */
        const quota = await MaintenanceDailyQuota.findOneAndUpdate(
            {
                tenantId: user.userId,
                dateKey,
            },
            [
                {
                    $set: {
                        count: {
                            $add: [{ $ifNull: ["$count", 0] }, 1],
                        },
                        expiresAt: {
                            $literal: new Date(
                                Date.now() + COUNTER_RETENTION_MS,
                            ),
                        },
                    },
                },
            ],
            {
                upsert: true,
                new: true,
            },
        );

        if (!quota) {
            next(new Error("Could not update the maintenance daily quota."));
            return;
        }

        if (quota.count > DAILY_MAINTENANCE_LIMIT) {
            res.setHeader("Retry-After", String(retryAfterSeconds));
            res.status(429).json({
                success: false,
                code: "MAINTENANCE_DAILY_QUOTA_EXCEEDED",
                limit: DAILY_MAINTENANCE_LIMIT,
                window: "UTC calendar day",
                retryAfterSeconds,
                message:
                    "You have reached your daily maintenance request limit. Please try again after the daily reset.",
            });
            return;
        }

        next();
    } catch (error) {
        // Fail closed: do not allow unmetered submissions if MongoDB is unavailable.
        next(error);
    }
};

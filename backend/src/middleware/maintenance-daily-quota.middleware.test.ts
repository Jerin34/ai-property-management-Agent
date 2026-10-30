import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/maintenance-daily-quota.model.js", () => ({
    default: {
        findOneAndUpdate: vi.fn(),
    },
}));

import MaintenanceDailyQuota from "../models/maintenance-daily-quota.model.js";
import { maintenanceDailyQuotaLimiter } from "./maintenance-daily-quota.middleware.js";

const makeResponse = () => {
    const response = {
        status: vi.fn(),
        json: vi.fn(),
        setHeader: vi.fn(),
    };
    response.status.mockReturnValue(response);
    return response;
};

describe("maintenanceDailyQuotaLimiter", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("allows a tenant while their daily count is within the limit", async () => {
        vi.mocked(MaintenanceDailyQuota.findOneAndUpdate).mockResolvedValue({
            count: 20,
        } as never);

        const req = {
            user: { userId: "507f1f77bcf86cd799439011" },
        } as never;
        const res = makeResponse();
        const next = vi.fn();

        await maintenanceDailyQuotaLimiter(req, res as never, next);

        expect(MaintenanceDailyQuota.findOneAndUpdate).toHaveBeenCalledOnce();
        expect(MaintenanceDailyQuota.findOneAndUpdate).toHaveBeenCalledWith(
            expect.objectContaining({
                tenantId: "507f1f77bcf86cd799439011",
                dateKey: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
            }),
            expect.arrayContaining([
                expect.objectContaining({
                    $set: expect.objectContaining({
                        count: expect.any(Object),
                        expiresAt: expect.any(Object),
                    }),
                }),
            ]),
            { upsert: true, new: true ,updatePipeline: true},
        );
        expect(next).toHaveBeenCalledOnce();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("returns 429 when a tenant exceeds the daily limit", async () => {
        vi.mocked(MaintenanceDailyQuota.findOneAndUpdate).mockResolvedValue({
            count: 21,
        } as never);

        const req = {
            user: { userId: "507f1f77bcf86cd799439011" },
        } as never;
        const res = makeResponse();
        const next = vi.fn();

        await maintenanceDailyQuotaLimiter(req, res as never, next);

        expect(res.setHeader).toHaveBeenCalledWith(
            "Retry-After",
            expect.any(String),
        );
        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                code: "MAINTENANCE_DAILY_QUOTA_EXCEEDED",
                limit: 20,
            }),
        );
        expect(next).not.toHaveBeenCalled();
    });

    it("does not allow requests without an authenticated tenant", async () => {
        const req = { user: undefined } as never;
        const res = makeResponse();
        const next = vi.fn();

        await maintenanceDailyQuotaLimiter(req, res as never, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(MaintenanceDailyQuota.findOneAndUpdate).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("passes database errors to Express error handling instead of failing open", async () => {
        const error = new Error("MongoDB unavailable");
        vi.mocked(MaintenanceDailyQuota.findOneAndUpdate).mockRejectedValue(error);

        const req = {
            user: { userId: "507f1f77bcf86cd799439011" },
        } as never;
        const res = makeResponse();
        const next = vi.fn();

        await maintenanceDailyQuotaLimiter(req, res as never, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});


import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";

const mocks = vi.hoisted(() => ({
    createNotifications: vi.fn((_req, res) =>
        res.status(201).json({ success: true })
    ),
    getNotification: vi.fn((_req, res) =>
        res.status(200).json({ success: true })
    ),
    markasReadNotifications: vi.fn((_req, res) =>
        res.status(200).json({ success: true })
    ),
    generateNotification: vi.fn((_req, res) =>
        res.status(200).json({ success: true })
    ),
}));

// Simulate authentication while keeping the real role middleware.
vi.mock("../middleware/auth.middileware.js", () => ({
    default: (req: any, res: any, next: any) => {
        const role = req.headers["x-test-role"];

        if (!role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        req.user = {
            userId: "test-user-id",
            role,
        };

        next();
    },
}));

vi.mock("../controllers/notification.controller.js", () => ({
    createNotifications: mocks.createNotifications,
    getNotification: mocks.getNotification,
    markasReadNotifications: mocks.markasReadNotifications,
    generateNotification: mocks.generateNotification,
}));

import notificationRouter from "./notification.routes.js";

const app = express();
app.use(express.json());
app.use("/api/notifications", notificationRouter);

describe("Notification route authorization", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 401 when the user is unauthenticated", async () => {
        const response = await request(app)
            .get("/api/notifications");

        expect(response.status).toBe(401);
        expect(mocks.getNotification).not.toHaveBeenCalled();
    });

    it("blocks a Manager from generating notifications from alerts", async () => {
        const response = await request(app)
            .post("/api/notifications/generate_from_alerts")
            .set("x-test-role", "MANAGER");

        expect(response.status).toBe(403);
        expect(mocks.generateNotification).not.toHaveBeenCalled();
    });

    it("allows an Admin to generate notifications from alerts", async () => {
        const response = await request(app)
            .post("/api/notifications/generate_from_alerts")
            .set("x-test-role", "ADMIN");

        expect(response.status).toBe(200);
        expect(mocks.generateNotification).toHaveBeenCalledOnce();
    });

    it("allows a Manager to create notifications", async () => {
        const response = await request(app)
            .post("/api/notifications")
            .set("x-test-role", "MANAGER")
            .send({});

        expect(response.status).toBe(201);
        expect(mocks.createNotifications).toHaveBeenCalledOnce();
    });
});

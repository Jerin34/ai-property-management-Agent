import type { Request, Response } from "express";
import {
    browseActiveProperties,
    createPropertyStayRequest,
    getTenantStayRequests,
    getManagerStayRequests,
    reviewPropertyStayRequest,
} from "../services/property-stay-request.service.js";

export const browseProperties = async (_req: Request, res: Response): Promise<void> => {
    try {
        const properties = await browseActiveProperties();
        res.status(200).json({ success: true, data: properties });
    } catch (error) {
        console.error("Browse properties failed:", error);
        res.status(500).json({ success: false, message: "Failed to fetch properties" });
    }
};

export const requestToStay = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }
        const request = await createPropertyStayRequest(req.user.userId, String(req.params.id));
        res.status(201).json({ success: true, message: "Property stay request submitted", data: request });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to submit request";
        const status = message === "Property not found" ? 404
            : message.includes("already") || message.includes("pending") ? 409
            : message.includes("required") || message.includes("inactive") ? 400 : 500;
        res.status(status).json({ success: false, message });
    }
};

export const getMyRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }
        const requests = await getTenantStayRequests(req.user.userId);
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.error("Fetch tenant requests failed:", error);
        res.status(500).json({ success: false, message: "Failed to fetch your requests" });
    }
};

export const getRequestsForManager = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }
        const requests = await getManagerStayRequests(req.user.userId);
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.error("Fetch manager requests failed:", error);
        res.status(500).json({ success: false, message: "Failed to fetch property requests" });
    }
};

export const reviewRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }
        const decision = req.body.decision;
        if (decision !== "APPROVE" && decision !== "REJECT") {
            res.status(400).json({ success: false, message: "Decision must be APPROVE or REJECT" });
            return;
        }
        const request = await reviewPropertyStayRequest(String(req.params.requestId), req.user.userId, decision);
        res.status(200).json({
            success: true,
            message: decision === "APPROVE" ? "Tenant approved and property assigned" : "Request rejected",
            data: request,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to review request";
        const status = message === "Request not found" ? 404
            : message.includes("cannot review") ? 403
            : message.includes("already") ? 409
            : message.includes("inactive") ? 400 : 500;
        res.status(status).json({ success: false, message });
    }
};

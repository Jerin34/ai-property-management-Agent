import mongoose from "mongoose";
import Property from "../models/property.models.js";
import User from "../models/user.model.js";
import PropertyStayRequest from "../models/property-stay-request.model.js";
import TenantPropertyAssignment from "../models/tenant-property-assignment.model.js";
import { ROLES } from "../constants/roles.js";

export const browseActiveProperties = async () => {
    return Property.find({ isActive: true })
        .select("_id name address description manager")
        .populate("manager", "name email")
        .sort({ name: 1 });
};

export const createPropertyStayRequest = async (tenantId: string, propertyId: string) => {
    if (!mongoose.isValidObjectId(propertyId)) throw new Error("Property not found");

    const [property, tenant, activeAssignment, pendingRequest] = await Promise.all([
        Property.findOne({ _id: propertyId, isActive: true }),
        User.findById(tenantId),
        TenantPropertyAssignment.findOne({ tenant: tenantId, property: propertyId, status: "ACTIVE" }),
        PropertyStayRequest.findOne({ tenant: tenantId, property: propertyId, status: "PENDING" }),
    ]);

    if (!property) throw new Error("Property not found or inactive");
    if (!tenant || tenant.role !== ROLES.Tenant || !tenant.isActive) {
        throw new Error("An active tenant account is required");
    }
    if (activeAssignment) throw new Error("You are already assigned to this property");
    if (pendingRequest) throw new Error("You already have a pending request for this property");

    return PropertyStayRequest.create({ tenant: tenantId, property: propertyId, status: "PENDING" });
};

export const getTenantStayRequests = async (tenantId: string) => {
    return PropertyStayRequest.find({ tenant: tenantId })
        .populate("property", "name address")
        .sort({ createdAt: -1 });
};

export const getManagerStayRequests = async (managerId: string) => {
    const properties = await Property.find({ manager: managerId }).select("_id");
    const propertyIds = properties.map((property) => property._id);
    return PropertyStayRequest.find({ property: { $in: propertyIds }, status: "PENDING" })
        .populate("tenant", "name email")
        .populate("property", "name address")
        .sort({ createdAt: 1 });
};

export const reviewPropertyStayRequest = async (
    requestId: string,
    managerId: string,
    decision: "APPROVE" | "REJECT"
) => {
    if (!mongoose.isValidObjectId(requestId)) throw new Error("Request not found");

    const request = await PropertyStayRequest.findById(requestId).populate("property");
    if (!request) throw new Error("Request not found");

    const property = request.property as unknown as { _id: mongoose.Types.ObjectId; manager: mongoose.Types.ObjectId; isActive: boolean };
    if (property.manager.toString() !== managerId) throw new Error("You cannot review requests for this property");
    if (request.status !== "PENDING") throw new Error("This request has already been reviewed");
    if (!property.isActive) throw new Error("Property is inactive");

    if (decision === "APPROVE") {
        const existingAssignment = await TenantPropertyAssignment.findOne({
            tenant: request.tenant,
            property: property._id,
            status: "ACTIVE",
        });
        if (existingAssignment) throw new Error("Tenant is already assigned to this property");

        await TenantPropertyAssignment.create({
            tenant: request.tenant,
            property: property._id,
            assignedBy: managerId,
            status: "ACTIVE",
            startDate: new Date(),
        });
    }

    request.status = decision === "APPROVE" ? "APPROVED" : "REJECTED";
    request.reviewedBy = new mongoose.Types.ObjectId(managerId);
    request.reviewedAt = new Date();
    await request.save();
    return request;
};

import Property from "../models/property.models.js";
import User from "../models/user.model.js";
import TenantPropertyAssignment from "../models/tenant-property-assignment.model.js";
import { ROLES } from "../constants/roles.js";

export const assignTenantToProperty = async (
    propertyId: string,
    tenantId: string,
    assignedBy: string
) => {
    const [property, tenant] = await Promise.all([
        Property.findById(propertyId),
        User.findById(tenantId),
    ]);

    if (!property || !property.isActive) {
        throw new Error("Property not found or inactive");
    }
    if (!tenant || tenant.role !== ROLES.Tenant || !tenant.isActive) {
        throw new Error("An active tenant account is required");
    }

    const existingAssignment = await TenantPropertyAssignment.findOne({
        property: propertyId,
        tenant: tenantId,
        status: "ACTIVE",
    });

    if (existingAssignment) {
        throw new Error("Tenant is already assigned to this property");
    }

    return TenantPropertyAssignment.create({
        property: propertyId,
        tenant: tenantId,
        assignedBy,
        status: "ACTIVE",
        startDate: new Date(),
    });
};

export const getTenantAssignedProperties = async (tenantId: string) => {
    return TenantPropertyAssignment.find({
        tenant: tenantId,
        status: "ACTIVE",
    })
        .populate("property", "name address description location isActive")
        .sort({ startDate: -1 });
};

export const endTenantPropertyAssignment = async (
    propertyId: string,
    tenantId: string
) => {
    const assignment = await TenantPropertyAssignment.findOneAndUpdate(
        {
            property: propertyId,
            tenant: tenantId,
            status: "ACTIVE",
        },
        {
            $set: {
                status: "ENDED",
                endDate: new Date(),
            },
        },
        { new: true, runValidators: true }
    );

    if (!assignment) {
        throw new Error("Active tenant assignment not found");
    }

    return assignment;
};

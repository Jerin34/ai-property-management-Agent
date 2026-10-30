import mongoose, { Schema } from "mongoose";

export type TenantPropertyAssignmentStatus = "ACTIVE" | "ENDED";

export interface ITenantPropertyAssignment {
    tenant: mongoose.Types.ObjectId;
    property: mongoose.Types.ObjectId;
    assignedBy: mongoose.Types.ObjectId;
    status: TenantPropertyAssignmentStatus;
    startDate: Date;
    endDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const tenantPropertyAssignmentSchema = new Schema<ITenantPropertyAssignment>(
    {
        tenant: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        property: {
            type: Schema.Types.ObjectId,
            ref: "property",
            required: true,
        },
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "ENDED"],
            default: "ACTIVE",
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
            required: true,
        },
        endDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

// A tenant can have only one active assignment for a given property.
// Historical ended assignments remain available for auditing.
tenantPropertyAssignmentSchema.index(
    { tenant: 1, property: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "ACTIVE" },
    }
);

const TenantPropertyAssignment = mongoose.model<ITenantPropertyAssignment>(
    "TenantPropertyAssignment",
    tenantPropertyAssignmentSchema
);

export default TenantPropertyAssignment;


// A tenant can have only one active residential property at a time.
tenantPropertyAssignmentSchema.index(
    { tenant: 1 },
    { unique: true, partialFilterExpression: { status: "ACTIVE" } }
);

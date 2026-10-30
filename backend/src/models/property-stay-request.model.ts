import mongoose, { Schema } from "mongoose";

export type PropertyStayRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IPropertyStayRequest {
    tenant: mongoose.Types.ObjectId;
    property: mongoose.Types.ObjectId;
    status: PropertyStayRequestStatus;
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const propertyStayRequestSchema = new Schema<IPropertyStayRequest>(
    {
        tenant: { type: Schema.Types.ObjectId, ref: "User", required: true },
        property: { type: Schema.Types.ObjectId, ref: "property", required: true },
        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING",
            required: true,
        },
        reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
        reviewedAt: { type: Date },
    },
    { timestamps: true }
);

propertyStayRequestSchema.index(
    { tenant: 1, property: 1 },
    { unique: true, partialFilterExpression: { status: "PENDING" } }
);

const PropertyStayRequest = mongoose.model<IPropertyStayRequest>(
    "PropertyStayRequest",
    propertyStayRequestSchema
);

export default PropertyStayRequest;

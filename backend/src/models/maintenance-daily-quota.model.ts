import mongoose, { Schema } from "mongoose";

export interface IMaintenanceDailyQuota {
    tenantId: mongoose.Types.ObjectId;
    dateKey: string;
    count: number;
    expiresAt: Date;
}

const maintenanceDailyQuotaSchema = new Schema<IMaintenanceDailyQuota>({
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dateKey: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

maintenanceDailyQuotaSchema.index(
    { tenantId: 1, dateKey: 1 },
    { unique: true },
);

// MongoDB removes old counters automatically after their expiry time.
maintenanceDailyQuotaSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 },
);

const MaintenanceDailyQuota = mongoose.model<IMaintenanceDailyQuota>(
    "MaintenanceDailyQuota",
    maintenanceDailyQuotaSchema,
);

export default MaintenanceDailyQuota;

import mongoose, { Schema, Types } from "mongoose";

export interface IMaintenanceUpdate {
    maintenance: Types.ObjectId;
    user: Types.ObjectId;
    message: string;
}

const maintenanceUpdateSchema = new Schema<IMaintenanceUpdate>(
    {
        maintenance: {
            type: Schema.Types.ObjectId,
            ref: "Maintainance",
            required: true
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const MaintenanceUpdate = mongoose.model<IMaintenanceUpdate>(
    "MaintenanceUpdate",
    maintenanceUpdateSchema
);

export default MaintenanceUpdate;
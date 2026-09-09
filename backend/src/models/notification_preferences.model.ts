import mongoose, { Schema } from "mongoose";
import { INotificationPreferences } from "../types/notification_preferences.types.js";

const NotificationPreferenceSchema =
    new Schema<INotificationPreferences>(
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
                unique: true
            },

            emergencyMaintenance: {
                type: Boolean,
                default: true
            },

            highPriorityUnresolved: {
                type: Boolean,
                default: true
            },

            lowPropertyHealth: {
                type: Boolean,
                default: true
            },

            maintenanceBacklog: {
                type: Boolean,
                default: true
            }
        },
        {
            timestamps: true
        }
    );

const NotificationPreferenceModel =
    mongoose.model<INotificationPreferences>(
        "NotificationPreference",
        NotificationPreferenceSchema
    );

export default NotificationPreferenceModel;
import { INotification } from "../types/notification-service.types.js";
import mongoose ,{Schema} from "mongoose";

const NotificationSchema = new Schema <INotification>(
    {
        recipient:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        type:{
            type:String,
            enum:[   "MAINTENANCE_ASSIGNED",
        "MAINTENANCE_UPDATED",
        "MAINTENANCE_COMPLETED",
        "EMERGENCY_MAINTENANCE",
        "HIGH_PRIORITY_UNRESOLVED",
        "LOW_PROPERTY_HEALTH",
        "MAINTENANCE_ESCALATED",
        "MAINTENANCE_BACKLOG"]
        },
        maintenanceId:{
            type:Schema.Types.ObjectId,
            ref:"Maintenance"
        },
        propertyId: {
    type: Schema.Types.ObjectId,
    ref: "Property"
},
        severity:{
            type:String,
            enum:['LOW','MEDIUM','HIGH','CRITICAL']
        },
        title:{
            type:String,
            required:true
        },
        message:{
            type:String,
            required:true
        },
        isRead:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:true
    }
)
const NotificationModel = mongoose.model<INotification>(
    "Notification",
    NotificationSchema
)
export default NotificationModel
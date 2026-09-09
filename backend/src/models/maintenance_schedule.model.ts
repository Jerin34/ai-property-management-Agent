import mongoose,{Schema} from "mongoose";
import { IMaintenanceSchedule } from "../types/maintenance_schedule.types.js";

const maintenanceScheduleSchema = new Schema<IMaintenanceSchedule>({

    property:{
        type:Schema.Types.ObjectId,
        ref:'property',
        required:true,
    },
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    category:{
        type:String,
       enum:[  "PLUMBING",
                    "ELECTRICAL",
                    "HVAC",
                    "APPLIANCE",
                    "STRUCTURAL",
                    "OTHER"],
                    required:true,
    },

    frequency:{
        type:String,
        enum:['DAILY','WEEKLY','MONTHLY','QUARTERLY','YEARLY'],
       required:true
    },
    nextDueDate:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},
{
timestamps:true
}
)
const MaintenanceSchedule = mongoose.model<IMaintenanceSchedule>("MaintenanceSchedule",maintenanceScheduleSchema);
export default MaintenanceSchedule
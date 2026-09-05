import mongoose, {Schema} from "mongoose";
import {
    MAINTENANCE_STATUS,
    MAINTENANCE_PRIORITY,
    MAINTENANCE_CATEGORY 
} from '../constants/maintenance.js'
import type { MaintenanceCategory,MaintenancePriority,MaintenanceStatus } from '../constants/maintenance.js';
export interface IMaintainance{
    property:mongoose.Types.ObjectId;
    tenant:mongoose.Types.ObjectId;
    title:string;
    description:string;
     aiSummary:string;
    category:MaintenanceCategory;
    priority:MaintenancePriority;
    status:MaintenanceStatus;
    technician:mongoose.Types.ObjectId,
    createdAt?:Date;
    updatedAt?:Date;
   
}
const maintainanceSchema = new Schema<IMaintainance>({
    property:{
        type:Schema.Types.ObjectId,
        ref:'property',
            required:true,
    },
    tenant:{
        type:Schema.Types.ObjectId,
        ref:'User',
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
       aiSummary:{
        type:String,
        ref:'summary',
        trim:true
    },
    category:{
        type:String,
        enum:Object.values(MAINTENANCE_CATEGORY),
        default:MAINTENANCE_CATEGORY.Other,
    },
    priority:{
        type:String,
        enum:Object.values(MAINTENANCE_PRIORITY),
        default:MAINTENANCE_PRIORITY.Medium,
    },
    status:{
        type:String,
        enum:Object.values(MAINTENANCE_STATUS),
        default:MAINTENANCE_STATUS.Open
    },
    technician:{
        type:Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
 

},{
    timestamps:true
})
const Maintaince = mongoose.model<IMaintainance>(
    "Maintainance",
    maintainanceSchema
);
export default Maintaince
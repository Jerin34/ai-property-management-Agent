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
    esclationLevel?:"NONE"|'HIGH'|'CRITICAL';
    status:MaintenanceStatus;
    technician:mongoose.Types.ObjectId,
    escaltedAt?:Date;
    createdAt?:Date;
    updatedAt?:Date;
    estimatedCost?:number;
    actualCost?:number;
    laborCost?:number;
    materialCost?:number;
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
    esclationLevel:{
        type:String,
        enum:['NONE','HIGH','CRITICAL'],
        default:'NONE'
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
    escaltedAt:{
        type:Date
    },
    estimatedCost:{
        type:Number,
        min:0
    },
    actualCost:{
        type:Number,
        min:0,
    },
    laborCost:{
        type:Number,
        min:0
    },
    materialCost:{
        type:Number,
        min:0
    }


 

},{
    timestamps:true
})
const Maintaince = mongoose.model<IMaintainance>(
    "Maintainance",
    maintainanceSchema
);
export default Maintaince
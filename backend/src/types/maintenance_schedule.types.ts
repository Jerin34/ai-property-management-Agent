import mongoose from "mongoose";
export type MaintenanceFrequency = | "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
export interface IMaintenanceSchedule {
    property:mongoose.Types.ObjectId;
    title:string;
    description?:string;
    category:string;
    frequency:MaintenanceFrequency;
    nextDueDate:Date;
    isActive:boolean;
}
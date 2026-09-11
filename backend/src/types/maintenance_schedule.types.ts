import mongoose from "mongoose";
import { MaintenanceCategory } from "../constants/maintenance.js";
export type MaintenanceFrequency = | "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
export interface IMaintenanceSchedule {
    property:mongoose.Types.ObjectId;
    title:string;
    description?:string;
    category:MaintenanceCategory;
    frequency:MaintenanceFrequency;
    nextDueDate:Date;
    isActive:boolean;
}
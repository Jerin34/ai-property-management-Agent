import mongoose from "mongoose";
export type NotificationType =
    | "MAINTENANCE_ASSIGNED"
    | "MAINTENANCE_UPDATED"
    | "MAINTENANCE_COMPLETED"
    | "EMERGENCY_MAINTENANCE"
    | "HIGH_PRIORITY_UNRESOLVED"
    | "LOW_PROPERTY_HEALTH"
    | "MAINTENANCE_BACKLOG";

export type NotificationSeverity = |'LOW'| 'MEDIUM' | 'HIGH' | 'CRITICAL';


export interface INotification{
    recipient:mongoose.Types.ObjectId;
    propertyId?: mongoose.Types.ObjectId;
    maintenanceId?:mongoose.Types.ObjectId;
    type:NotificationType;
    severity:NotificationSeverity
    title:string;
    message:string;
    isRead:boolean
}
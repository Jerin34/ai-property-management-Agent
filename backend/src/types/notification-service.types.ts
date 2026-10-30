import mongoose from "mongoose";
export type NotificationType =
  | "MAINTENANCE_ASSIGNED"
  | "MAINTENANCE_UPDATED"
  | "MAINTENANCE_COMPLETED"
  | "EMERGENCY_MAINTENANCE"
  | "HIGH_PRIORITY_UNRESOLVED"
  | "LOW_PROPERTY_HEALTH"
  | "MAINTENANCE_ESCALATED"
  | "MAINTENANCE_BACKLOG"
  | "MAINTENANCE_REQUEST_CREATED"
  | "TECHNICIAN_ASSIGNED"
  | "MAINTENANCE_STARTED";

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
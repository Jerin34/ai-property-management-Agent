export type NotificationType =  | "MAINTENANCE_ASSIGNED" | "MAINTENANCE_UPDATED" | "MAINTENANCE_COMPLETED" | "EMERGENCY__MAINTENANCE" | "HIGH_PRIORITY_UNRESOLVED" | "LOW_PROPERTY_HEALTH" | "MAINTENANCE_BACKLOG" | "MAINTENANCE_ESCALATED";
export type NotificationSeverity = | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export interface Notification{
    _id:string;
    recipient:string;
    propertyId:string;
    maintenanceId:string;
    type:NotificationType;
    severity:NotificationSeverity;
    title:string;
    message:string;
    isRead:boolean;
    createdAt:string;
    updatedAt:string;
}

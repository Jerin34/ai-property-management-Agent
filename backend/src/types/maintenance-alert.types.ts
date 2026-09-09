import { NotificationType } from "./notification-service.types.js";
export interface MaintenanceAlertType{
    
    propertyId: string;
    maintenanceId?: string;
    type: NotificationType;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    message: string;
}

export interface NotificationPreferences {
    _id:string;
    user:string;
    emergencyMaintenance:boolean;
    highPriorityUnresolved:boolean;
    lowPropertyHealth:boolean;
    maintenanceBacklog:boolean;
    createdAt:string;
    updatedAt:string;
}
export interface UpdateNotificationPreferences {
    emergencyMaintenance?:boolean;
    highPriorityUnresolved?:boolean;
    lowPropertyHealth?:boolean;
    maintenanceBacklog?:boolean;
}

export type MaintenanceFrequency = | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "YEARLY";
export type MaintenanceScheduleCategroy = | "PLUMBING" | "ELECTRICAL" | "HVAC" | "APPLIANCE" | "STRUCTURAL" | "OTHER";

export interface MaintenanceSchedule {
    _id: string;
    property: string;
    title: string;
    description: string;
    category: MaintenanceScheduleCategroy;
    frequency: MaintenanceFrequency;
    nextDueDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMaintenanceSchedule {
    property: string;
    title: string;
    description?: string;
    category: MaintenanceScheduleCategroy;
    frequency: MaintenanceFrequency;
    nextDueDate: string;
    isActive?: boolean;
}

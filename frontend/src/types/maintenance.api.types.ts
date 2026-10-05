import type { Maintenance,  MaintenanceUpdates } from "../types/maintenance.types";
import type { RecurringMaintenance } from "./recurring-maintenance.types";
export interface MaintenanceListResponse{
    success: boolean;
    message: string;
    data: Maintenance[]
}
export interface MaintenanceResponse{
    success:boolean;
    message:string;
    data:Maintenance
}

export interface RecurringMaintenanceResponse {
  success: boolean;
  message?: string;
  data: RecurringMaintenance;
}
export interface MaintenanceUpdatesResponse {
  success: boolean;
  message: string;
  data: MaintenanceUpdates[];
}
export interface createMaintenanceUpdateResponse{
    success: boolean;
    message: string;
}
import type { Maintenance } from "../types/maintenance.types";
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
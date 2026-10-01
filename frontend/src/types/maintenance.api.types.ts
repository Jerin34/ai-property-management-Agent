import type { Maintenance } from "../types/maintenance.types";
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
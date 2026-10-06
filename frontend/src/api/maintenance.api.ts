import apiClient from "./client";
import type {
  Maintenance,
  CreateMaintenanceInput,
  AssignTechnicianInput,
  UpdateMaintenanceStatusInput,
MaintenanceUpdates,
createMaintenanceUpdateInput
} from "../types/maintenance.types";

import type {
  MaintenanceListResponse,
  MaintenanceResponse,
  MaintenanceUpdatesResponse,
  createMaintenanceUpdateResponse
} from "../types/maintenance.api.types";
import type { TechnicianRecommendation } from "../types/technician.types";
interface TechinicanRecommendationResponse{
  success:boolean
  message?:string
  data:TechnicianRecommendation[]
}
import type { RecurringMaintenance } from "../types/recurring-maintenance.types";
import type { RecurringMaintenanceResponse } from "../types/maintenance.api.types";


/*
 * Get maintenance requests
 *
 * Backend:
 * GET /api/maintenance
 *
 * Available to:
 * ADMIN
 * MANAGER
 * TENANT
 */
export const getMaintenanceRequests = async (): Promise<
  Maintenance[]
> => {
  const response =
    await apiClient.get<MaintenanceListResponse>(
      "/maintenance"
    );

  return response.data.data;
};

/*
 * Get a single maintenance request
 *
 * Backend:
 * GET /api/maintenance/:id
 *
 * Available to:
 * ADMIN
 * MANAGER
 * TENANT
 */
export const getMaintenanceById = async (
  id: string
): Promise<Maintenance> => {
  const response =
    await apiClient.get<MaintenanceResponse>(
      `/maintenance/${id}`
    );

  return response.data.data;
};
/*
 * Create maintenance request
 *
 * Backend:
 * POST /api/maintenance
 *
 * Available to:
 * TENANT
 */
export const createMaintenanceRequest = async (
  data: CreateMaintenanceInput
): Promise<Maintenance> => {
  const response =
    await apiClient.post<MaintenanceResponse>(
      "/maintenance",
      data
    );

  return response.data.data;
};


/*
 * Assign technician
 *
 * Backend:
 * PATCH /api/maintenance/:id/assign
 *
 * Available to:
 * MANAGER
 */
export const assignTechnician = async (
  id: string,
  data: AssignTechnicianInput
): Promise<Maintenance> => {
  const response =
    await apiClient.patch<MaintenanceResponse>(
      `/maintenance/${id}/assign`,
      data
    );

  return response.data.data;
};


/*
 * Update maintenance status
 *
 * Backend:
 * PATCH /api/maintenance/:id/status
 *
 * Available to:
 * TECHNICIAN
 */
export const updateMaintenanceStatus = async (
  id: string,
  data: UpdateMaintenanceStatusInput
): Promise<Maintenance> => {
  const response =
    await apiClient.patch<MaintenanceResponse>(
      `/maintenance/${id}/status`,
      data
    );

  return response.data.data;
};


/*
 * Update maintenance cost
 *
 * Backend:
 * PATCH /api/maintenance/:id/cost
 *
 * Available to:
 * TECHNICIAN
 */
export const updateMaintenanceCost = async (
  id: string,
  data: {
    laborCost?: number;
    materialCost?: number;
  }
): Promise<Maintenance> => {
  const response =
    await apiClient.patch<MaintenanceResponse>(
      `/maintenance/${id}/cost`,
      data
    );

  return response.data.data;
};

//Technician Recommendation
export const getTechnicianRecommendation = async (
  id: string
): Promise<TechnicianRecommendation[]> => {
  const response =
    await apiClient.get<TechinicanRecommendationResponse>(
      `/maintenance/${id}/recommend-technician`
    );

  return response.data.data;
};
export const getRecurringMaintenance = async (
  id: string
): Promise<RecurringMaintenance> => {
  const response =
    await apiClient.get<RecurringMaintenanceResponse>(
      `/maintenance/${id}/recurring`
    );

  return response.data.data;
};
export const getTechnicianMaintenanceRequests = async():Promise<Maintenance[]>=>{
  const response = await apiClient.get<MaintenanceListResponse>(
    `/maintenance/technician/my-requests`
  )
  return response.data.data
}
export const getMaintenanceUpdates = async(id:string):Promise<MaintenanceUpdates[]> =>{
  const response = await apiClient.get<MaintenanceUpdatesResponse>(`/maintenance/${id}/updates`);
  return response.data.data
}
export const createMaintenanceUpdate = async(id:string,data:createMaintenanceUpdateInput):Promise<createMaintenanceUpdateResponse> =>{
  const response =  await apiClient.post<createMaintenanceUpdateResponse>(`/maintenance/${id}/updates`,data);
  return response.data;
}

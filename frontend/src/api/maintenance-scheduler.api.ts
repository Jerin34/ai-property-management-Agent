import apiClient from "./client";

import type {
    MaintenanceSchedule,
    CreateMaintenanceSchedule
} from "../types/maintenance-scheduler.types";

interface MaintenanceScheduleResponse {
    success: boolean;
    data: MaintenanceSchedule;
}

interface MaintenanceSchedulesResponse {
    success: boolean;
    data: MaintenanceSchedule[];
}

export const createMaintenanceSchedule = async (
    data: CreateMaintenanceSchedule
): Promise<MaintenanceSchedule> => {

    const response =
        await apiClient.post<MaintenanceScheduleResponse>(
            "/maintenance_schedules/",
            data
        );

    return response.data.data;
};

export const getMaintenanceSchedules = async (
    propertyId?: string
): Promise<MaintenanceSchedule[]> => {

    const response =
        await apiClient.get<MaintenanceSchedulesResponse>(
            "/maintenance_schedules/",
            {
                params: propertyId
                    ? { propertyId }
                    : undefined
            }
        );

    return response.data.data;
};

export const getMaintenanceScheduleById = async (
    id: string
): Promise<MaintenanceSchedule> => {

    const response =
        await apiClient.get<MaintenanceScheduleResponse>(
            `/maintenance_schedules/${id}`
        );

    return response.data.data;
};

export const getDueMaintenanceSchedules =
    async (): Promise<MaintenanceSchedule[]> => {

        const response =
            await apiClient.get<MaintenanceSchedulesResponse>(
                "/maintenance_schedules/due"
            );

        return response.data.data;
    };

export const processDueMaintenanceSchedules =
    async () => {

        const response =
            await apiClient.post(
                "/maintenance_schedules/process-due"
            );

        return response.data.data;
    };
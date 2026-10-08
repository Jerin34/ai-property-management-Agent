import apiClient from "./client";
import type { MaintenanceSLAMetrics } from "../types/maintenance-sla.types";

interface MaintenanceSLAResponse {
    success: boolean;
    data: MaintenanceSLAMetrics;
}

export const getMaintenanceSLAMetrics =
    async (): Promise<MaintenanceSLAMetrics> => {
        const response =
            await apiClient.get<MaintenanceSLAResponse>(
                "/maintenance_sla/"
            );

        return response.data.data;
    };

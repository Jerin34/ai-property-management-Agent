import apiClient from "./client";
import type { MaintenanceCostAnalytics } from "../types/maintenance-cost-analytics.types";

interface MaintenanceCostAnalyticsResponse {
    success: boolean;
    data: MaintenanceCostAnalytics;
}

export const getMaintenanceCostAnalytics =
    async (): Promise<MaintenanceCostAnalytics> => {
        const response =
            await apiClient.get<MaintenanceCostAnalyticsResponse>(
                "/maintenance_cost/"
            );

        return response.data.data;
    };

import apiClient from "./client";
import type { MaintenanceAnalytics} from '../types/analytics.types'

interface MaintenaceAnalyticsResponse{
    success:boolean;
    data:MaintenanceAnalytics
}
const getMaintenaceAnalytics = async():Promise<MaintenanceAnalytics> =>{
    const response = await apiClient.get<MaintenaceAnalyticsResponse>("/maintenance_analytics/");
    return response.data.data;
}
export default getMaintenaceAnalytics
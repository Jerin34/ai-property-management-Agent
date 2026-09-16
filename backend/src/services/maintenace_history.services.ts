import Maintaince from "../models/maintenance.model.js";
import { TenantMaintenanceHistory } from "../types/maintenance_history.types.js";
import { MAINTENANCE_STATUS,MAINTENANCE_PRIORITY } from "../constants/maintenance.js";
export const getMaintenaceHistory = async (tenantId: string): Promise<TenantMaintenanceHistory> => {
    const maintenanceHistory = await Maintaince.find({tenant:tenantId}).sort({ createdAt: -1 }); 
    const totalRequests = maintenanceHistory.length;
    const openRequests = maintenanceHistory.filter(request => request.status === MAINTENANCE_STATUS.Open).length;
    const inProgressRequests = maintenanceHistory.filter(request => request.status === MAINTENANCE_STATUS.InProgress).length;
    const completedRequests = maintenanceHistory.filter(request => request.status === MAINTENANCE_STATUS.COMPLETED).length;
    const emergencyRequests = maintenanceHistory.filter(request => request.priority === MAINTENANCE_PRIORITY.Emergency).length;
    const categoryCounts:Record<string,number>={};
    for(const category of maintenanceHistory){
        categoryCounts[category.category] = (categoryCounts[category.category] || 0) + 1;
    }
    let mostCommonCategory : string | null = null;
    let highestCount = 0;
    for(const category in categoryCounts){
        if(categoryCounts[category] > highestCount){
            highestCount = categoryCounts[category];
            mostCommonCategory = category;
        }
    }
    const recentRequests = maintenanceHistory.slice(0,5).map(request => ({
        maintenanceId:request._id.toString(),title:request.title,category:request.category,priority:request.priority,status:request.status,createdAt:request.createdAt
    }))
    return{
        totalRequests,
        openRequests,
        inProgressRequests,
        completedRequests,
        emergencyRequests,
        mostCommonCategory,
        recentRequests
    };
    

}
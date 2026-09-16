export interface TenantMaintenanceHistory{
    totalRequests:number;
    openRequests:number;
    inProgressRequests:number;
    completedRequests:number;
    emergencyRequests:number;
    mostCommonCategory:string|null;
    recentRequests:{
        maintenanceId:string;   
        title:string;
        category:string;
        priority:string;
        status:string;
        createdAt?:Date
    }[];
}

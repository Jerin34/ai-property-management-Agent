export interface MaintenanceSLAMetrics {
    totalRequests: number;
    completedRequests: number;
    breachedRequests: number;
    complianceRate: number;
    averageResolutionTimeHours: number;
    byPriority: {
        priority: string;
        totalRequests: number;
        breachedRequests: number;
        complianceRate: number;
    }[];
}

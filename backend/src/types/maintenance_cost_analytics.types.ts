    export interface MaintenanceCostAnalytics {
    totalEstimatedCost: number;
    totalActualCost: number;
    totalLaborCost: number;
    totalMaterialCost: number;

    costVariance: number;
    averageActualCost: number;

    mostExpensiveRequest: {
        maintenanceId: string;
        title: string;
        actualCost: number;
    } | null;

    byCategory: Record<string, number>;

    byProperty: {
        propertyId: string;
        propertyName: string;
        actualCost: number;
    }[];
}

export interface MaintenanceCostPrediction{
    maintenanceId:string,
    predictedCost:number,
    confidence: 'LOW' | 'MEDIUM' | 'HIGH',
    reason:string
}
export type EscalationLevel = 'NONE'|'HIGH'|'CRITICAL'
export interface IMaintenanceEscaltion{
    maintenanceId:string;
    propertyId:string;
    escalationLevel:EscalationLevel,
    reasons:string;
}
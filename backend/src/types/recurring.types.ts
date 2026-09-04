export interface RecurringMaintenaceResult{
    isRecurring:boolean;
    requestCount:number;
    propertyId:string;
    category:string;
    periodDays:number;
    message:string;
}
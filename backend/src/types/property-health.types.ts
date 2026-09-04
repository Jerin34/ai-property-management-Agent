export interface PropertyHealthResult  {
    propertyId:string;
    healthScore:number;
    riskLevel:string;
    totalRequests:number;
   highPriorityRequests: number;
    emergencyRequests: number;
    openRequests: number;
    reasons: string[];

}
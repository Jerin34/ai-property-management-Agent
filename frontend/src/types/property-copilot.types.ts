import  type { PropertyHealthResult } from "./property-health.types";
export interface PropertyCopilotResult {
    property: {
        id:string;
        name:string;
    };
    health:PropertyHealthResult;
    analysis:string
}
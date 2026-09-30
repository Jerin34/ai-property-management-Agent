    import type { Property } from "../types/property.types";
    import apiClient from "./client";
    import type { PropertyHealthResult } from "../types/property-health.types";
    import type { PropertyCopilotResult } from "../types/property-copilot.types";
    interface PropertyResponse{
        success:boolean;
        message?:string;
        data:Property[];
    }
    interface PropertiesResponse{
          success:boolean;
        message?:string;
        data:Property;
    }
    interface PropertyCopilotResponse{
        success:boolean;
        data:PropertyCopilotResult
    }
    interface PropertyHealthResponse{
        success:boolean;
        data:PropertyHealthResult
    }
    export const getProperties = async():Promise<Property[]> =>{
        const response = await apiClient.get<PropertyResponse>("/properties/my");
        return response.data.data;
    }
    export const getPropertyById = async(id:string):Promise<Property> =>{
        const response = await apiClient.get<PropertiesResponse>(`/properties/${id}`);
        return response.data.data;
    }
    export const getPropertiesHealth = async(id:string):Promise<PropertyHealthResult> =>{
        const response = await apiClient.get<PropertyHealthResponse>(`/properties/${id}/health`);
        return response.data.data;
    }
    export const getPropertyCopilot = async(id:string):Promise<PropertyCopilotResult> =>{
        const response = await apiClient.get<PropertyCopilotResponse>(`/properties/${id}/copilot`);
        return response.data.data;
    }
    
    import type { Property } from "../types/property.types";
    import apiClient from "./client";
    import type { PropertyHealthResult } from "../types/property-health.types";
    import type { PropertyCopilotResult } from "../types/property-copilot.types";
    export interface CreatePropertyRequest{
        name:string;
        address:{
            street:string;
            city:string;
            state:string;
            postalcode:string;
            country:string;
        };
        description?:string;
        location?:{
            latitude:number;
            longitude:number;
        };
    }
    export interface AvailableProperty {
    _id: string;
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        postalcode: string;
        country: string;
    };
}
    interface CreatePropertyResponse{
        success:boolean;
        message:string;
        data:Property;
    }
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
    export const  createProperty = async(data:CreatePropertyRequest):Promise<Property> =>{
        const response = await apiClient.post<CreatePropertyResponse>("/properties",data);
        return response.data.data;
    }
    export const getAvailableProperties = async (): Promise<AvailableProperty[]> => {
    const response = await apiClient.get<{
        success: boolean;
        data: AvailableProperty[];
    }>("/properties/available");

    return response.data.data;
};
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
    
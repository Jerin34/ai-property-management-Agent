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
export const activateProperty = async(id:string) =>{
    const response =  await apiClient.patch(`/properties/${id}/activate`);
    return response.data;
}
export const deactivateProperty = async(id:string) =>{
    const resposne = await apiClient.patch(`/properties/${id}/deactivate`);
    return resposne.data;
}
export const assignTenantToProperty = async (propertyId: string, tenantEmail: string) => {
    const response = await apiClient.post(
        `/properties/${propertyId}/tenants`,
        { tenantEmail }
    );
    return response.data;
};

export interface BrowseProperty extends AvailableProperty {
    description?: string;
    manager?: { _id: string; name?: string; email?: string } | string;
}
export interface PropertyStayRequest {
    _id: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    property: { _id: string; name: string; address?: { street?: string; city?: string } } | string;
    tenant: { _id: string; name?: string; email?: string } | string;
}
export interface TenantPropertyAssignment {
    _id: string;
    status: "ACTIVE" | "ENDED";
    property: { _id: string; name: string; address?: { street?: string; city?: string } } | string;
}
export const browseProperties = async (): Promise<BrowseProperty[]> => {
    const response = await apiClient.get<{ success: boolean; data: BrowseProperty[] }>("/properties/browse");
    return response.data.data;
};
export const requestToStay = async (propertyId: string) => {
    const response = await apiClient.post("/properties/" + propertyId + "/requests");
    return response.data;
};
export const getMyPropertyRequests = async (): Promise<PropertyStayRequest[]> => {
    const response = await apiClient.get<{ success: boolean; data: PropertyStayRequest[] }>("/properties/requests/mine");
    return response.data.data;
};
export const getManagerPropertyRequests = async (): Promise<PropertyStayRequest[]> => {
    const response = await apiClient.get<{ success: boolean; data: PropertyStayRequest[] }>("/properties/requests/manager");
    return response.data.data;
};
export const reviewPropertyRequest = async (requestId: string, decision: "APPROVE" | "REJECT") => {
    const response = await apiClient.patch("/properties/requests/" + requestId, { decision });
    return response.data;
};
export const getMyTenantAssignments = async (): Promise<TenantPropertyAssignment[]> => {
    const response = await apiClient.get<{ success: boolean; data: TenantPropertyAssignment[] }>("/properties/tenants/my");
    return response.data.data;
};

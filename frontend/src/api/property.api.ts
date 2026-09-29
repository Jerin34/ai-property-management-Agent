import type { Property } from "../types/property.types";
import apiClient from "./client";
interface PropertyResponse{
    success:boolean;
    message?:string;
    data:Property[];
}
export const getProperties = async():Promise<Property[]> =>{
    const response = await apiClient.get<PropertyResponse>("/properties/my");
    return response.data.data;
}
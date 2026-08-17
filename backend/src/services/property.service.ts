import Property from "../models/property.models.js";
import { createPropertyInput } from "../validator/property.validator.js";
export const createProperty = async(data:createPropertyInput, managerId:string) =>{
    const property =await Property.create({...data,manager:managerId})
    return property
}
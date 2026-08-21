import Property from "../models/property.models.js";
import { createPropertyInput,updatePropertyInput } from "../validator/property.validator.js";

export const createProperty = async(data:createPropertyInput, managerId:string) =>{
    const property =await Property.create({...data,manager:managerId})
    return property
}
export const getMyProperties = async(managerId:string) =>{
    const properties = await Property.find({
        manager:managerId
    })
    return properties
}
export const getPropertyByid = async(propertyId:string)=>{
    const property = await Property.findById(propertyId);
    if(!property){
        throw new Error("Property Not Find")
    }
    return property;
}
export const updateProperty = async (propertyId:string,data:updatePropertyInput) =>{
    const property = await Property.findByIdAndUpdate(
        propertyId,
        data,
        {
            new:true,
            runValidators:true,
        }
    );
    if(!property){
        throw new Error("Property Not Found")
    }
    return property;

}
export const deactivateProperty = async(propertyId:string) =>{
    const property = await Property.findByIdAndUpdate(
        propertyId,
        {
            isActive:false
        },
        {
            new:true
        }

    )
    if(!property){
        throw new Error("Property not found")
    }
    return property;
}
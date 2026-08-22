import Maintaince from "../models/maintenance.model.js";
import Property from "../models/property.models.js";
import type { createMaintenanceInput } from "../validator/maintenance.validator.js";
export const createMaintenanceReq = async(data:createMaintenanceInput,tenantId:string) =>{
    const property = await Property.findById(data.propertyId)
    if(!property){
        throw new Error("Property not found")
    }
    const maintenance = Maintaince.create({
        property:data.propertyId,
        tenant:tenantId,
        title:data.title,
        description:data.description
    });
    return maintenance
};


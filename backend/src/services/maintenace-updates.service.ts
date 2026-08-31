import MaintenaceUpdate from "../models/maintenance.update.model.js";
import Maintaince from "../models/maintenance.model.js";
import  Property from '../models/property.models.js'
import { ROLES } from "../constants/roles.js";
import type { Role } from "../constants/roles.js";
export const createMaintenaceUpdate = async (maintenanceId:string,userId:string,message:string,role:Role) => {
    const maintenance = await Maintaince.findById(maintenanceId);
    if(!maintenance){
        throw new Error("Maintenance not found");
    }
    if(role === ROLES.Tenant){
        if(maintenance.tenant.toString() !== userId ){
            throw new Error("You are not allowed to update this request")
        }
    }
    if(role === ROLES.Technician){
        if(!maintenance.technician  || maintenance.technician.toString() !== userId ){
            throw new Error("You are not allowed to update this request")
        }
    }
    if(role === ROLES.Manager){
        const property = await Property.findById(maintenance.property);
        if(!property  || property.manager.toString() !== userId ){
            throw new Error("You are not allowed to update this request");
        }
    }
    const update = new MaintenaceUpdate({
        maintenance:maintenanceId,
        user:userId,
        message
    });

    await  update.save();
}

export const viewMaintenaceReq = async(maintenaceId:string) =>{
    const maintenance = await Maintaince.findById(maintenaceId);
    if(!maintenance){
        throw new Error("Maintenace Request was not found")
    }
    const updates = await MaintenaceUpdate.find({maintenance:maintenaceId}).populate("user","name email phone").sort({createdAt:1});
    return updates;
}
import Maintaince from "../models/maintenance.model.js";
import Property from "../models/property.models.js";
import User from  '../models/user.model.js'
import type { createMaintenanceInput } from "../validator/maintenance.validator.js";
import { analyseMaintenaceRequest } from "./ai.service.js";
import {ROLES} from '../constants/roles.js'
import type { Role } from "../constants/roles.js";
import { MAINTENANCE_STATUS } from "../constants/maintenance.js";
import { gnerateManagerInsights } from './ai.service.js'

export const createMaintenanceReq = async(data:createMaintenanceInput,tenantId:string) =>{
    const property = await Property.findById(data.propertyId)
    if(!property){
        throw new Error("Property not found")
    }
    const aiResult = await analyseMaintenaceRequest(data.description);
    const maintenance = Maintaince.create({
        property:data.propertyId,
        tenant:tenantId,
        title:data.title,
        description:data.description,
        aiSummary:aiResult.summary,
        category:aiResult.category,
        priority:aiResult.priority,
        status:MAINTENANCE_STATUS.Open,
        
    });
    return maintenance
};

export const getMaintenanceReq = async( userId:string,role:Role) =>{
    if(role === ROLES.Admin){ //All requests
       return await Maintaince.find().populate("property","name address").populate("tenant","name address").populate("technician","name address")
    }
    if(role === ROLES.Tenant){
        return await Maintaince.find({tenant:userId}).populate("property", "name address").populate("technician", "name address")
    }
    if(role === ROLES.Manager){
        const properties =  await Property.find({manager:userId}).select("_id")
        const propertyIds =  properties.map((property) => property._id)
        const requests =  await Maintaince.find({
            property:{ $in : propertyIds},
        })
        .populate('property',"name address").populate("tenant", "name email address").populate("technician", "name email address")
        return requests;
    }
    return [];
};
export const getMaintenanceReqById = async(maintenanceId:string)=>{

        const maintenance = await Maintaince.findById(maintenanceId).populate("property","name email manager").populate("tenant","email nane phone").populate('technician',"name email phone")
        if(!maintenance){
            throw new Error("Property Not Found")
        }
        return maintenance   
}
export const assignTechnician= async(maintenanceId:string,techicianId:string) =>{
    const maintenance = await Maintaince.findById(maintenanceId)
    if(!maintenance){
        throw new Error("Maintenance Request Not Found")
    }
    const technician = await User.findById(techicianId)
    if(!technician){
        throw new Error("Technician Not Found")
    }
    if(technician.role !==  ROLES.Technician){
        throw new Error("User is not a technician")
    }
    maintenance.technician = technician._id
    maintenance.status = 'IN_PROGRESS'
    await maintenance.save();
    return maintenance;
}
export  const ViewTechnicianReq = async(technicianId:string) =>{
   return await Maintaince.find({technician:technicianId}).populate("property","name address").populate("tenant","name email phone").populate("technician","name email phone")

};
export const updateMaintenanceStatus = async(maintenaceId:string,technicianId:string,status:"IN_PROGRESS"|"COMPLETED") =>{
    const maintenance = await Maintaince.findById(maintenaceId)
    if(!maintenance){
        throw new Error("Maintenance Request Not Found")
    }
    if(!maintenance.technician || maintenance.technician._id.toString() != technicianId){
        throw new Error("You are not assigned to this maintenance request")
    }
    maintenance.status = status;
    await maintenance.save();
    return maintenance;
}
export const getManagerinsights = async(managerId:string)=>{
    const requests = await getMaintenanceReq(managerId,ROLES.Manager);
    const insights = await gnerateManagerInsights(requests);
    return insights;
}

import MaintenaceUpdate from "../models/maintenance.update.model.js";
import Maintaince from "../models/maintenance.model.js";
import  Property from '../models/property.models.js'
import { ROLES } from "../constants/roles.js";
import type { Role } from "../constants/roles.js";
import { createNotification } from "./notification.services.js";
export const createMaintenaceUpdate = async (maintenanceId:string,userId:string,message:string,role:Role) => {
    const maintenance = await Maintaince.findById(maintenanceId);
    if(!maintenance){
        throw new Error("Maintenance request not found");
    }
   if (role !== ROLES.Technician) {
    throw new Error("Only technicians can create maintenance updates");
}

if (
    !maintenance.technician ||
    maintenance.technician.toString() !== userId
) {
    throw new Error("You are not allowed to update this request");
}
    
    const cleanMessage = message.trim();
    const update = new MaintenaceUpdate({
        maintenance: maintenanceId,
        user: userId,
        message: cleanMessage,
    });

    await update.save();

    // Notify the tenant after the technician's update has been persisted.
    try {
        await createNotification({
            recipient: maintenance.tenant.toString(),
            maintenanceId: maintenance._id.toString(),
            propertyId: maintenance.property.toString(),
            type: "MAINTENANCE_UPDATED",
            severity: "MEDIUM",
            title: "Maintenance work update",
            message: `The technician posted an update for "${maintenance.title}": ${cleanMessage}`,
            isRead: false,
        });
    } catch (error) {
        console.error("Failed to notify tenant about maintenance update:", error);
    }

    return update;
}

export const viewMaintenaceReq = async(maintenaceId:string) =>{
    const maintenance = await Maintaince.findById(maintenaceId);
    if(!maintenance){
        throw new Error("Maintenace Request was not found")
    }
    const updates = await MaintenaceUpdate.find({maintenance:maintenaceId}).populate("user","name email phone").sort({createdAt:1});
    return updates;
}
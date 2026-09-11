import MaintenanceSchedule from "../models/maintenance_schedule.model.js";
import { CreateMaintenanceScheduleInput } from '../validator/maintenance_scheduler.validator.js';
export const createMaintenanceSchedule = async(data:CreateMaintenanceScheduleInput) =>{
    const maintenanceSchedule = await MaintenanceSchedule.create(data)
    return maintenanceSchedule
}
export const getMaintenanceSchedule = async(propertyId?:string) =>{
 const query  = propertyId ? {property:propertyId}:{};
 const schedules  = await MaintenanceSchedule.find(query).sort({nextDueDate:-1});
 return schedules
}
export const getMaintenanceScheduleById = async(id:string) =>{
    const schedule  =  await MaintenanceSchedule.findById(id);
    return schedule;
}
export const getMaintenaceDueSchedules = async() =>{
    const now = new Date();
    const schedules = await MaintenanceSchedule.find({isActive:true,nextDueDate:{$lte:now}}).sort({nextDueDate:-1});
    return schedules;
}   
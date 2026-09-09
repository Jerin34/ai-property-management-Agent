import { Request,Response } from 'express';
import { createMaintenanceSchedule ,getMaintenanceSchedule,getMaintenanceScheduleById  } from '../services/maintenance_scheduler.services.js';
import  { createMaintenanceScheduleSchema } from '../validator/maintenance_scheduler.validator.js'
export const createSchedule = async(req:Request,res:Response):Promise<void> =>{
    try{
        const validateData = await createMaintenanceScheduleSchema.parse(req.body);
        const schedule = await createMaintenanceSchedule(validateData);
        res.status(201).json({success:true,data:schedule});
    }
    catch(err){
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
export const getSchedule = async(req:Request,res:Response):Promise<void> =>{
    try{
     const propertyId =
    typeof req.query.propertyId === "string"
        ? req.query.propertyId
        : undefined;
        const schedules = await getMaintenanceSchedule(propertyId);
        res.status(200).json({success:true,data:schedules});
    }
    catch(err){
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

export const getScheduleById = async(req:Request,res:Response):Promise<void> =>{
    try{
            const scheduleId = req.params.id.toString();

        const schedule =
            await getMaintenanceScheduleById(scheduleId);

        if (!schedule) {
            res.status(404).json({
                success: false,
                message: "Maintenance schedule not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: schedule
        });
    }
    catch(err){
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
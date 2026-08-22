import { Request,Response } from 'express'
import { createMaintenanceReq } from '../services/maintenance.service.js'
import { success } from 'zod'
export const createMaintenance = async(req:Request,res:Response) :Promise<void> =>{
    try{
    const user = req.user
    if(!user){
        res.status(401).json({success:false,message:'Authentication is Required'})
        return ;
    }
    const maintenance = await createMaintenanceReq(
        req.body,
        user.userId
    );
     res.status(201).json({
            success: true,
            message: "Maintenance Request Created Successfully",
            data: maintenance,
     })
    }catch(err){
        if(err instanceof Error && err.message === 'Property not found'){
             res.status(404).json({
                success: false,
                message: "Property not found",
            });
            return;
        }
        res.status(500).json({
            success:false,
            message:'Internal Server Error'
        });
    };

};
import {Request,Response} from 'express';
import {ProcessmaintenanceEscaltion} from '../services/maintenance_escalation.services.js';
export const getMaintenanceEscalation = async(req:Request,res:Response) => {
    try{
        const escalations = await ProcessmaintenanceEscaltion();
        res.status(200).json({success:true,data:escalations})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

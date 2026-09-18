import { Request,Response } from "express";
import { getMaintenanceSLAMetrics} from "../services/maintenance_sla.services.js";
export const getSLAmetrics = async(req:Request,res:Response):Promise<void> =>{
    try{
        const metrics = await getMaintenanceSLAMetrics();
        res.status(200).json({success:true,data:metrics});
    }
    catch(error){
        res.status(500).json({success:false,message:'Internal server error'});
    }
}
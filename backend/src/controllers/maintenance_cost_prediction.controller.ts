import {Request,Response} from 'express'
import { predictMaintenanceCost } from '../services/maintenance_cost_prediction.services.js'
export const getMaintenanceCostPrediction = async(req:Request,res:Response):Promise<void> =>{
    try{
        const maintenanceId = req.params.id.toString();
        const prediction = await predictMaintenanceCost(maintenanceId);
        res.status(200).json({success:true,data:prediction});
    }catch(err){
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

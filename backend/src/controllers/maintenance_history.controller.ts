import { Request,Response } from "express";
import { getMaintenaceHistory } from '../services/maintenace_history.services.js'
export const viewMaintenanceHistory = async(req:Request,res:Response):Promise<void> =>{
    try{
        console.log("Controller reached")
        const tenantId = req.user!.userId;
        const history = await getMaintenaceHistory(tenantId);
        res.status(200).json({
            success:true,data:history
        })
    }
    catch(err){
        console.log("error printing",err)
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
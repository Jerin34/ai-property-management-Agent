import {Request,Response} from "express";
import { updateMaintenanceCost } from  '../services/maintenance_cost.services.js'
import { updateMaintenanceCostSchema } from '../validator/maintenance_cost.validator.js'
export const updateCost = async(req:Request,res:Response):Promise<void> =>{
try{
    const maintenacneId = req.params.id.toString();
    const validatedData = updateMaintenanceCostSchema.parse(req.body);
    const maintenance = await updateMaintenanceCost(maintenacneId,validatedData);
    res.status(201).json({success:true,data:maintenance});
}
catch(err){
    console.log(err);
    if(err instanceof Error && err.message === 'Maintenance request not found'){
        res.status(404).json({success:false,message:"Maintenance request not found"});
        return ;
    }
    res.status(500).json({success:false,message:"Internal Server Error"}); 
}
}
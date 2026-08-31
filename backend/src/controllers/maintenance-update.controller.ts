import {Request,Response} from 'express';
import {createMaintenaceUpdate as createMaintenaceUpdateService, viewMaintenaceReq as viewMaintenanceReqService} from '../services/maintenace-updates.service.js';
export const createMaintenaceUpdate = async (req:Request,res:Response):Promise<void>=>{
    try{
        const user = req.user;
        if(!user){
            res.status(401).json({success:false,message:"Unauthorized"});
            return ;
        }
        const maitenanceId = req.params.id.toString();
        const {message} = req.body;
        await createMaintenaceUpdateService(maitenanceId,user.userId,message,user.role);
        res.status(201).json({success:true,message:"Maintenace update created successfully"});
    }
catch(err){
    if(err instanceof Error && err.message === 'You are not allowed to update this request'){
        res.status(401).json({success:false,message:"You are not allowed to update this request"});
    }
        if(err instanceof Error && err.message === 'Maintenance request not found'){
            res.status(404).json({success:false,message:"Maintenance request not found"});
            return ;
        }
        res.status(500).json({success:false,message:"Internal server error"});
    }
    
}
export const viewMaintenaceReq = async(req:Request,res:Response):Promise<void> =>{
    try{
        const maintenaceId = req.params.id.toString();
        const updates = await viewMaintenanceReqService(maintenaceId);
        res.status(200).json({success:true,message:'Maintenace updates fetched successfully',data:updates});
    }
    catch(err){
        if(err instanceof Error && err.message === "Maintenance request not found"){
            res.status(404).json({
                success:false,message:"Maintenance request not found"
            })
            return;
    }
    res.status(500).json({
        success:false,message:"Internal server Error"
    })
    }

}
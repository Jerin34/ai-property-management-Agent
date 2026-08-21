import type {Request,Response} from 'express';
import { createProperty, getMyProperties,getPropertyByid as getPropertyByIdService,updateProperty as updatePropertyService} from '../services/property.service.js';
import {ROLES} from '../constants/roles.js'
import { success } from 'zod';
export const create  =  async(req:Request,res:Response): Promise<void>=>{
    try{
        if(!req.user){
             res.status(401).json({
                success:false,
                message:'Unauthorized User'
            })
            return ;
        }
        const property = await createProperty(
            req.body,
            req.user.userId
        );
        res.status(201).json({
            success:true,
            message:'Property Created Successfully',
            data:property
        })
    }
    catch(err){
        res.status(400).json({
            success:false,
            message:'Property Creation Failed',
            error:err
        })
    }

}
export const getProperties = async(req:Request,res:Response):Promise<void> =>{
try{
    const user = req.user;
    if(!user){
        res.status(401).json({
            success:false,
            message:"Authentication is Required"
        })
        return ;
    }
    const managerId = user.userId
    const properties = await getMyProperties(managerId)
    res.status(200).json({success:true,message:'Properties Fetched SuccessFully',data:properties});
}
catch(err){
    res.status(500).json({
        success:false,message:'Internal Server Error'
    })
}
}
export const getPropertyById = async(req:Request,res:Response):Promise<void> =>{
    try{
        const user = req.user;

        if(!user){
            res.status(401).json({
                success:false,message:"Authentication is Required"
            })
            return;
        }
        const propertyid = req.params.id.toString();
        const property = await getPropertyByIdService(propertyid)
    if(user.role === ROLES.Admin){
        res.status(200).json({success:true,data:property})
        return;
    }
    if(property.manager.toString() !== user.userId){
        res.status(403).json({
            success:false,
            message:"You are not allowed to view this Property"
        })
        return ;
    }
    res.status(200).json({
        success:true,data:property
    })
    }
    catch(err){
        if(err instanceof Error &&  err.message === "Property not found")
        {
             res.status(404).json({
                success:false,message:"Property not found"
            })
            return ;
        }

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
export const updateProperty =async (req:Request,res:Response):Promise<void> =>{
    try{
        const user  =req.user;
        if(!user){
            res.status(401).json({
                success:false,
                message:'Authentication Required'
            });
          return;    
        }
          const propertyId = req.params.id.toString()
            const property = await getPropertyByIdService(propertyId);
            if(user.role !== ROLES.Admin){
                if(property.manager.toString() !== user.userId){
                    res.status(403).json({
                        success:false,
                        message:"You are not allowed to do this operation"
                    })
                    return;
                }
            }
            const updatedProperty = await updatePropertyService(propertyId,req.body)
            res.status(200).json({success:true,message:"Property updatedSuccessFully",data:updatedProperty})
    }catch(err){
        if(err instanceof Error && err.message === "Property not found"){
            res.status(404).json({
                success:false,message:'Property not found'
            });
            return ;
        }
        res.status(500).json({
            success:false,message:'Internal Server Error'
        });
    }
};
import type {Request,Response} from 'express';
import { createProperty } from '../services/property.service.js';
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
import type {Request,Response} from 'express';
import {updateUserRole} from '../services/user.services.js'
export const updateRole = async(req:Request,res:Response):Promise<void> =>{
    try{
    const userId = req.params.id
    if(typeof userId !== 'string'){
        res.status(400).json({
            success:false,message:'User id is Required'
        });
    return;
    }
    const user = await updateUserRole(userId,req.body)
    res.status(200).json({
        success:true,message:"Role Updated SuccessFully",data:user
    })

    }
    catch(err){
        if(err instanceof Error && err.message === "User not found"){
            res.status(404).json({
                success:false,
                message:'User not found'
            })
            return;
        }
        res.status(500).json({
            success:false,
            message:'Internal Server Error'
        })
       
    }
}
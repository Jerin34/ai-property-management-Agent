import {Request,Response} from 'express';
import { getNotificationPreferences,updateNotificationPreferences} from '../services/notification_preferences.services.js'
import { updateNotificationPreferenceSchema } from '../validator/notification_preferences.validator.js';

export const getNotificationPreference = async(req:Request,res:Response):Promise<void> =>{
    try{
    const userId = req.user!.userId;
    const preferences = await getNotificationPreferences(userId);
    res.status(200).json({success:true,data:preferences});
    }
    catch(err){
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
export const updateNotificationPreference = async(req:Request,res:Response):Promise<void> =>{
    try{
        const userId = req.user!.userId;
        const validateData =  updateNotificationPreferenceSchema.parse(req.body);
        const preferences = await  updateNotificationPreferences(userId,validateData);
        res.status(200).json({success:true,data:preferences});
    }
    catch(err){
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
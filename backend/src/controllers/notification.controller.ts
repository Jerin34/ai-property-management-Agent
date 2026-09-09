import {Request,Response} from 'express'
import { createNotification as createNotificationService,getNotifications as getNotificationsService,markasReadNotifications as markasReadNotificationsService} from "../services/notification.services.js";
import { generateNotificationsFromAlerts } from '../services/notification-generation.service.js';

export const createNotifications = async(req:Request,res:Response)=>{
    try{
        const notificationId = req.body;
    const notification = await createNotificationService(notificationId);
    res.status(201).json({success:true,data:notification})

    }
    catch(err){
     
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }

}
export const getNotification = async(req:Request,res:Response)=>{
    try{
    const userId = req.user!.userId;
    const notification = await getNotificationsService(userId);
    res.status(200).json({success:true,data:notification})
}
catch(err){
    res.status(500).json({
        success:false,
        message:"Internal Server Error"
    })
}
}

export const markasReadNotifications = async(req:Request,res:Response)=>{
    try{
    const userId  = req.user!.userId;
    const notificationIds = req.body.notificationIds;
    const notification = await markasReadNotificationsService(userId,notificationIds);
    res.status(200).json({success:true,data:notification})
    }
    catch(err){
        
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
};

export const generateNotification = async(req:Request,res:Response):Promise<void> =>{
    try{
        const notifications = await generateNotificationsFromAlerts();
        res.status(200).json({success:true,data:notifications});
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            success:false,message:"Intenal Server Error"
        })
    };
}

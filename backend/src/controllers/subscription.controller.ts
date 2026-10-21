import type { Request, Response } from "express"
import  subscriptionService  from "../services/subscription.services.js"

const createSubsription = async (req:Request,res:Response):Promise<void> =>{
    try{
        if(!req.user?.userId){
            res.status(401).json({success:false,message:"Authentication Required"}) ;
            return ;
        }
        const role = req.user.role;
        if(role === "TECHNICIAN" || role === "ADMIN"){
            res.status(403).json({success:false,message:"You are not authorized to create subscription"}) ;
            return ;
        }
        if(role === "MANAGER"){
            res.status(409).json({success:false,message:"You are already subscribed"}) ;
            return ;
        }
        if(role !== "TENANT"){
            res.status(403).json({success:false,message:"You are not eligible for this subscription"});
            return ;
        }
        const subscription = await subscriptionService.createSubscription(req.user.userId);
        res.status(201).json({success:true,subscription:subscription,message:'Subscription Created Successfully'});
    }
    catch(error){
        console.error(error);
        if (error instanceof Error) {
    if (
      error.message === "User already has an active subscription" ||
      error.message === "User already subscribed"
    ) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }
  }

  res.status(500).json({
    success: false,
    message: "Failed to create subscription",
  });
      
    }
}
const subscriptionController = {
    createSubsription
}
export default subscriptionController;
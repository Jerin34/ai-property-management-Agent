import type {Request,Response} from 'express';
import {createHmac, timingSafeEqual} from 'crypto';
import env from '../config/env.js'
import subscriptionWebhookService from '../services/subscription-webhook.services.js';
const handleWebhook = async(req:Request,res:Response):Promise<void>=>{
    try{
        if(!Buffer.isBuffer(req.body)){
            res.status(400).json({
                success:false,message:"Invalid Webhook body",
            })
            return ;
        }
        const signature  = req.headers["x-razorpay-signature"];
      if (
    typeof signature !== "string" ||
    !/^[a-fA-F0-9]{64}$/.test(signature)
) {
    res.status(400).json({
        success: false,
        message: "Invalid Webhook Signature",
    });
    return;
}
        const expectedSignature = createHmac("sha256",env.RAZORPAY_WEBHOOK_SECRET,).update(req.body).digest();
        const recievedSignature = Buffer.from(signature,"hex");
        if(recievedSignature.length !== expectedSignature.length || !timingSafeEqual(recievedSignature,expectedSignature)){
            res.status(400).json({
                success:false,message:"Webhook Verification Failed",
            })
            return ;
        }
        let eventData :unknown;
        try{
            eventData = JSON.parse(req.body.toString("utf8"));
            console.log("Razorpay webhook received:", {
  event: (eventData as { event: string }).event,
  receivedAt: new Date().toISOString(),
});
        }catch{
            res.status(400).json({
                success:false,message:"Invalid webhook JSON"
            })
            return ;
        }
        if(typeof eventData !== "object" || eventData === null || !("event" in eventData) || typeof eventData === "string"){
            res.status(400).json({
                success:false,message:"Invalid webhook event Payload",
            })
            return ;
        }
            await subscriptionWebhookService.processEventWebhook(eventData as Parameters< typeof subscriptionWebhookService.processEventWebhook>[0],);
            res.status(200).json({
                success:true,message:"Webhook processed SuccessFully"
            })

    }catch(err){
        console.error("Subscription Webhook Processing Failed",err)
        res.status(500).json({
            success:false,
            message:"Webhook processing failed",
        })
    }
}
const subscriptionController = {
    handleWebhook
}
export default subscriptionController

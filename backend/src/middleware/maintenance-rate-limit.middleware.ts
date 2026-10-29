import {rateLimit} from "express-rate-limit";

export const maintenanceIpLimiter = rateLimit({
    windowMs:15*60*1000,
    limit:10,
    standardHeaders:true,
    legacyHeaders:false,
    message:{
        success:false,
        code:"MAINTENANCE_IP_RATE_LIMIT",
        message:"Too many maintenance requests from this network,please try again later.",
    },
});
export const maintenanceTenantLimiter = rateLimit({
    windowMs:15*60*1000,
    limit:5,
    keyGenerator:(req) => req.user!.userId,
    standardHeaders:true,
    legacyHeaders:false,
    message:{
        success:false,
        code:"MAINTENANCE_TENANT_RATE_LIMIT",
        message:"You have submitted maintenance requests to quickly.Please try again later",
    },
});
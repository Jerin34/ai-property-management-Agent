import { RequestHandler } from "express";
import type {Role} from "../constants/roles.js";
export const autihorize = (...allowedRoles:Role[]):RequestHandler=>{
    return (req,res,next) =>{
        if(!req.user){
            res.status(401).json({success:false,message:"Unauthorized"});
            return;
        }
        if(!allowedRoles.includes(req.user.role)){
            res.status(403).json({success:false,message:"You are not allowed do this action"});
            return;
        }
        next();
    };
};

import jwt from 'jsonwebtoken'
import {Request,Response,NextFunction} from 'express'
import env from '../config/env.js'
import type{Authuser} from '../types/auth.types.js'
const authenticate = (req:Request,res:Response,next:NextFunction):void =>{
    const authorization = req.headers.authorization
    if(!authorization){
         res.status(401).json({success:false,message:'Authentication Required'})
         return;
    }
    const token = authorization.split(' ')[1]
    if(!token){
        res.status(401).json({success:false,message:'Token is Missing'})
        return;
    }
    try{
        const decode = jwt.verify(token,env.JWT_SECRET)
            if(typeof decode === "string"){
                res.status(401).json({success:false,message:'Invalid Token'})
                return ;
            }
            const user:Authuser={
                userId:decode.userId as string,
                role:decode.role as Authuser['role'],
            };
            req.user = user
        next();
    }
    catch(err){
        res.status(401).json({success:false,message:'Invalid Token'})
    }
}
export default authenticate
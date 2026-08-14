import type {RequestHandler} from 'express';
import type {ZodType} from "zod";
export const validate = (schema:ZodType):RequestHandler =>{
    return (req,res,next) =>{
        const result = schema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                success:false,
                message:'validation failed',
                errors:result.error.issues,
            });
            return;
        }
        req.body = result.data;
        next();
    }
}


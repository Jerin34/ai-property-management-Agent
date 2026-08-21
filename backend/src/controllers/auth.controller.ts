import type {Request, Response} from 'express';
import authService from '../services/auth.service.js';
import { login } from '../services/auth.service.js'

const register = async(req:Request,res:Response): Promise<void> =>{
    try{
        const user = await authService.register(req.body)
        res.status(201).json({
            success:true,
            messsage:'User registered SuccessFully',
            data:user
        })
        
    }catch(err){
        const message = err instanceof Error?err.message : 'Registration Failed'
        res.status(400).json({success:false,message,})
    }

}
const me = async(req:Request,res:Response): Promise<void> =>{
    res.status(200).json({success:true,message:'Authentication SuccessFull',data: req.user,
    })
}
const loginUser = async(req:Request,res:Response):Promise<void> =>{
    try{
        const result = await login(req.body);
        res.status(200).json({
            success:true,
            message:"Login SuccessFull",
            data:result
        })
    }
    catch(err){
        if(err instanceof Error && err.message ==='Invalid email and password'){
             res.status(400).json({
                success:false,
                message:"Invalid email and password"
            })
            return ;
        }
        res.status(500).json({
            success:false,
            message:'Internal server error'
        });
    };

};
export default {register,me,loginUser}
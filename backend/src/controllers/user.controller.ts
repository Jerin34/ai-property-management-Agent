import type {Request,Response} from 'express';
import {updateUserRole,updateTechnicianSkills as updateTechnicianSkillsService,updateTechnicianLocation as updateTechnicianLocationService} from '../services/user.services.js'
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
export const updateTechnicianSkills = async(req:Request,res:Response) :Promise<void> =>{
    try{
        const technicianId = req.params.id.toString();
        const {skills} = req.body;
        const technician = await updateTechnicianSkillsService(technicianId,skills);
        res.status(200).json({
            success:true,message:"Skills Updated SuccessFully",data:{
                id:technician._id,name:technician.name,skills:technician.skills,email:technician.email,role:technician.role
            }
        });
    }
    catch(err){
        if(err instanceof Error && err.message === "Technician Not Found"){
            res.status(404).json({
                success:false,
                message:'Technician Not Found'
            })
        }
        if(err instanceof Error && err.message === "User is not a Technician"){
            res.status(404).json({
                success:false,message:"User is not a Technician"
            })
        }
        res.status(500).json({
            success:false,message:"Internal Server Error"
        })
    }
}
export const updateTechnicianLocation = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { latitude, longitude } = req.body;

        const technician = await updateTechnicianLocationService(
            req.user!.userId,
            latitude,
            longitude
        );

        res.status(200).json({
            success: true,
            data: {
                id: technician._id,
                name: technician.name,
                skills: technician.skills,
                email: technician.email,
                role: technician.role,
                location: technician.location
            }
        });
    } catch (err) {
        if (err instanceof Error && err.message === "Technician Not Found") {
            res.status(404).json({
                success: false,
                message: "Technician Not Found"
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
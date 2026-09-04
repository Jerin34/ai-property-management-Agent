import User from '../models/user.model.js';
import type {UpdateUserRoleInput} from '../validator/user.validator.js'
import  { ROLES } from '../constants/roles.js'
export const updateUserRole = async(userId:string,data:UpdateUserRoleInput) =>{
    const user = await User.findByIdAndUpdate(
        userId,
        {
            role:data.role,
        },
        {
            new:true,
            runValidators:true
        }
    );
    if(!user){
        throw new Error('No User Found')
    }
    return user;
};
export const updateTechnicianSkills = async(technicianId:string,skills:string[]) =>{
    const technician =  await User.findById(technicianId);
    if(!technician){
        throw new Error("Technician Not Found")
    }
    if(technician.role !== ROLES.Technician ){
        throw new Error("User is not a Technician")
    }
    technician.skills = skills;
    await technician.save();
    return technician;
}
export const updateTechnicianLocation = async(technicianId:string,latitude:number,longitude:number) =>{
    const technician = await User.findById(technicianId);
    if(!technician){
        throw new Error("Technician Not Found")
    }
    if(technician.role !== ROLES.Technician){
        throw new Error("User is not a Technician")
    }
    technician.location={
        latitude,
        longitude,
        updatedAt:new Date()
    }
    await technician.save();
    return technician;
}
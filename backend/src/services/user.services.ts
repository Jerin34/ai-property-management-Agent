import User from '../models/user.model.js';
import type {UpdateUserRoleInput} from '../validator/user.validator.js'
import  { ROLES } from '../constants/roles.js'
import mongoose from "mongoose";
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
export const getPendingRoleApprovals = async () => {
    return User.find({
        role: ROLES.Tenant,
        subscriptionStatus: "ACTIVE",
        roleApprovalStatus: "PENDING",
    })
        .select(
            "name email subscriptionStatus roleApprovalStatus roleApprovalRequestedAt createdAt"
        )
        .sort({ roleApprovalRequestedAt: 1 });
};
export const approveManagerRole = async (
    userId: string,
    adminId: string
) => {
    if (
        !mongoose.isValidObjectId(userId) ||
        !mongoose.isValidObjectId(adminId)
    ) {
        throw new Error("Invalid user or admin ID");
    }

    const user = await User.findOneAndUpdate(
        {
            _id: userId,
            role: ROLES.Tenant,
            subscriptionStatus: "ACTIVE",
            roleApprovalStatus: "PENDING",
        },
        {
            $set: {
                role: ROLES.Manager,
                roleApprovalStatus: "APPROVED",
                roleApprovedAt: new Date(),
                roleApprovedBy: new mongoose.Types.ObjectId(adminId),
            },
        },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password");

    if (!user) {
        throw new Error(
            "No eligible pending role approval found for this user"
        );
    }

    return user;
};
export const rejectManagerRole = async (userId: string) => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    const user = await User.findOneAndUpdate(
        {
            _id: userId,
            role: ROLES.Tenant,
            subscriptionStatus: "ACTIVE",
            roleApprovalStatus: "PENDING",
        },
        {
            $set: {
                roleApprovalStatus: "REJECTED",
            },
        },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password");

    if (!user) {
        throw new Error(
            "No eligible pending role approval found for this user"
        );
    }

    return user;
};
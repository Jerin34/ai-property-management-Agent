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

export const applyForTechnicianRole = async (userId: string) => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    const user = await User.findOneAndUpdate(
        {
            _id: userId,
            role: ROLES.Tenant,
            technicianApplicationStatus: { $in: ["NOT_REQUESTED", "REJECTED"] },
        },
        {
            $set: {
                technicianApplicationStatus: "PENDING",
                technicianApplicationRequestedAt: new Date(),
            },
            $unset: {
                technicianApprovedAt: 1,
                technicianApprovedBy: 1,
            },
        },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        const existing = await User.findById(userId).select("role technicianApplicationStatus");
        if (!existing) throw new Error("User not found");
        if (existing.role !== ROLES.Tenant) throw new Error("Only tenants can apply for Technician role");
        throw new Error("A Technician application is already pending or this account is not eligible");
    }

    return user;
};

export const getPendingTechnicianApplications = async () => {
    return User.find({
        role: ROLES.Tenant,
        technicianApplicationStatus: "PENDING",
    })
        .select("name email phone technicianApplicationStatus technicianApplicationRequestedAt createdAt")
        .sort({ technicianApplicationRequestedAt: 1 });
};

export const approveTechnicianRole = async (userId: string, adminId: string) => {
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(adminId)) {
        throw new Error("Invalid user or admin ID");
    }

    const user = await User.findOneAndUpdate(
        {
            _id: userId,
            role: ROLES.Tenant,
            technicianApplicationStatus: "PENDING",
        },
        {
            $set: {
                role: ROLES.Technician,
                technicianApplicationStatus: "APPROVED",
                technicianApprovedAt: new Date(),
                technicianApprovedBy: new mongoose.Types.ObjectId(adminId),
                profileCompleted: false,
                skills: [],
                serviceAreas: [],
            },
        },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        throw new Error("No pending Technician application found for this user");
    }

    return user;
};

export const rejectTechnicianRole = async (userId: string) => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    const user = await User.findOneAndUpdate(
        {
            _id: userId,
            role: ROLES.Tenant,
            technicianApplicationStatus: "PENDING",
        },
        { $set: { technicianApplicationStatus: "REJECTED" } },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        throw new Error("No pending Technician application found for this user");
    }

    return user;
};

export const getTechnicianProfile = async (technicianId: string) => {
    const technician = await User.findOne({
        _id: technicianId,
        role: ROLES.Technician,
    }).select("-password");

    if (!technician) throw new Error("Technician not found");
    return technician;
};

export const updateTechnicianProfile = async (
    technicianId: string,
    data: {
        skills: string[];
        experienceYears: number;
        serviceAreas: string[];
        availability: "FULL_TIME" | "PART_TIME" | "FLEXIBLE";
        workingHours: { start: string; end: string };
        bio?: string;
    }
) => {
    const technician = await User.findOne({
        _id: technicianId,
        role: ROLES.Technician,
    });

    if (!technician) throw new Error("Technician not found");

    if (data.workingHours.end <= data.workingHours.start) {
        throw new Error("Working hours end time must be later than start time");
    }

    technician.skills = [...new Set(data.skills)];
    technician.experienceYears = data.experienceYears;
    technician.serviceAreas = [...new Set(data.serviceAreas.map((area) => area.trim()))];
    technician.availability = data.availability;
    technician.workingHours = data.workingHours;
    technician.bio = data.bio?.trim() ?? "";
    technician.profileCompleted =
        technician.skills.length > 0 &&
        technician.experienceYears !== undefined &&
        technician.serviceAreas.length > 0 &&
        Boolean(technician.availability) &&
        Boolean(technician.workingHours.start) &&
        Boolean(technician.workingHours.end);

    await technician.save();
    return technician;
};

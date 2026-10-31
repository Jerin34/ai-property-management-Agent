import type {Request,Response} from 'express';
import {
    updateUserRole,
    updateTechnicianSkills as updateTechnicianSkillsService,
    updateTechnicianLocation as updateTechnicianLocationService,
    getPendingRoleApprovals,
    approveManagerRole,
    rejectManagerRole,
    applyForTechnicianRole as applyForTechnicianRoleService,
    getPendingTechnicianApplications,
    approveTechnicianRole as approveTechnicianRoleService,
    rejectTechnicianRole as rejectTechnicianRoleService,
    getTechnicianProfile as getTechnicianProfileService,
    updateTechnicianProfile as updateTechnicianProfileService,
    getTechnicianApplicationStatus,
} from '../services/user.services.js';
import type { UpdateTechnicianProfileInput } from '../validator/user.validator.js';
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

export const getPendingApprovals = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const requests = await getPendingRoleApprovals();

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });
    } catch (err) {
        console.error("Failed to fetch pending approvals:", err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch pending approvals",
        });
    }
};

export const approveManagerRoleRequest = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.params.id;
        if (typeof userId !== "string") {
    res.status(400).json({
        success: false,
        message: "Valid user ID is required",
    });
    return;
}
        const adminId = req.user?.userId;

        if (!userId || !adminId) {
            res.status(400).json({
                success: false,
                message: "User ID and authenticated Admin are required",
            });
            return;
        }

        const user = await approveManagerRole(userId, adminId);

        res.status(200).json({
            success: true,
            message: "Manager role approved successfully",
            data: user,
        });
    } catch (err) {
        if (
            err instanceof Error &&
            err.message === "Invalid user or admin ID"
        ) {
            res.status(400).json({
                success: false,
                message: err.message,
            });
            return;
        }

        if (
            err instanceof Error &&
            err.message.includes("No eligible pending role approval")
        ) {
            res.status(409).json({
                success: false,
                message: err.message,
            });
            return;
        }

        console.error("Failed to approve Manager role:", err);

        res.status(500).json({
            success: false,
            message: "Failed to approve Manager role",
        });
    }
};

export const rejectManagerRoleRequest = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.params.id;
        if (typeof userId !== "string") {
    res.status(400).json({
        success: false,
        message: "Valid user ID is required",
    });
    return;
}

        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }

        const user = await rejectManagerRole(userId);

        res.status(200).json({
            success: true,
            message: "Manager role request rejected",
            data: user,
        });
    } catch (err) {
        if (
            err instanceof Error &&
            err.message === "Invalid user ID"
        ) {
            res.status(400).json({
                success: false,
                message: err.message,
            });
            return;
        }

        if (
            err instanceof Error &&
            err.message.includes("No eligible pending role approval")
        ) {
            res.status(409).json({
                success: false,
                message: err.message,
            });
            return;
        }

        console.error("Failed to reject Manager role:", err);

        res.status(500).json({
            success: false,
            message: "Failed to reject Manager role",
        });
    }
};


export const applyForTechnicianRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await applyForTechnicianRoleService(req.user!.userId);
        res.status(201).json({
            success: true,
            message: "Technician application submitted successfully. It is free and awaiting Admin review.",
            data: user,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "";
        if (message === "Invalid user ID" || message === "Only tenants can apply for Technician role") {
            res.status(400).json({ success: false, message });
            return;
        }
        if (message === "User not found") {
            res.status(404).json({ success: false, message });
            return;
        }
        if (message.includes("already pending") || message.includes("not eligible")) {
            res.status(409).json({ success: false, message });
            return;
        }
        console.error("Technician application failed:", err);
        res.status(500).json({ success: false, message: "Failed to submit Technician application" });
    }
};

export const getPendingTechnicianRoleApprovals = async (_req: Request, res: Response): Promise<void> => {
    try {
        const requests = await getPendingTechnicianApplications();
        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (err) {
        console.error("Failed to fetch Technician applications:", err);
        res.status(500).json({ success: false, message: "Failed to fetch Technician applications" });
    }
};

export const approveTechnicianRoleRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const adminId = req.user?.userId;
        if (typeof userId !== "string" || !adminId) {
            res.status(400).json({ success: false, message: "User ID and authenticated Admin are required" });
            return;
        }
        const user = await approveTechnicianRoleService(userId, adminId);
        res.status(200).json({
            success: true,
            message: "Technician role approved. The user must sign in again and complete their Technician profile before receiving assignments.",
            data: user,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "";
        if (message === "Invalid user or admin ID") {
            res.status(400).json({ success: false, message });
            return;
        }
        if (message.includes("No pending Technician application")) {
            res.status(409).json({ success: false, message });
            return;
        }
        console.error("Failed to approve Technician role:", err);
        res.status(500).json({ success: false, message: "Failed to approve Technician role" });
    }
};

export const rejectTechnicianRoleRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        if (typeof userId !== "string") {
            res.status(400).json({ success: false, message: "Valid user ID is required" });
            return;
        }
        const user = await rejectTechnicianRoleService(userId);
        res.status(200).json({ success: true, message: "Technician application rejected", data: user });
    } catch (err) {
        const message = err instanceof Error ? err.message : "";
        if (message === "Invalid user ID") {
            res.status(400).json({ success: false, message });
            return;
        }
        if (message.includes("No pending Technician application")) {
            res.status(409).json({ success: false, message });
            return;
        }
        console.error("Failed to reject Technician application:", err);
        res.status(500).json({ success: false, message: "Failed to reject Technician application" });
    }
};

export const getTechnicianProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const profile = await getTechnicianProfileService(req.user!.userId);
        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        if (err instanceof Error && err.message === "Technician not found") {
            res.status(404).json({ success: false, message: err.message });
            return;
        }
        console.error("Failed to fetch Technician profile:", err);
        res.status(500).json({ success: false, message: "Failed to fetch Technician profile" });
    }
};

export const updateTechnicianProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const profile = await updateTechnicianProfileService(
            req.user!.userId,
            req.body as UpdateTechnicianProfileInput
        );
        res.status(200).json({
            success: true,
            message: profile.profileCompleted
                ? "Technician profile completed successfully"
                : "Technician profile updated",
            data: profile,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "";
        if (message === "Technician not found") {
            res.status(404).json({ success: false, message });
            return;
        }
        if (message.includes("Working hours")) {
            res.status(400).json({ success: false, message });
            return;
        }
        console.error("Failed to update Technician profile:", err);
        res.status(500).json({ success: false, message: "Failed to update Technician profile" });
    }
};


export const getMyTechnicianApplicationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const status = await getTechnicianApplicationStatus(req.user!.userId);
        res.status(200).json({ success: true, data: status });
    } catch (err) {
        console.error("Failed to fetch Technician application status:", err);
        res.status(500).json({ success: false, message: "Failed to fetch application status" });
    }
};

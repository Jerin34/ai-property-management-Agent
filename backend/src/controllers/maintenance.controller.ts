import { Request,Response } from 'express'
import { createMaintenanceReq,getMaintenanceReq,getMaintenanceReqById,assignTechnician as assignTechnicainService ,ViewTechnicianReq as ViewTechnicianRequsetService,updateMaintenanceStatus as updateMaintenanceStatusService,getManagerinsights as getManagerInsightsService} from '../services/maintenance.service.js'
import { recommendTechnicians } from '../services/recommendation.service.js'
import  { ROLES } from '../constants/roles.js'
import { MaintenanceAlertService } from '../services/maintenace-Alert_services.js'
import uploadImage from '../services/upload.service.js'
import { detectRecurringMaintenace } from "../services/recurring.service.js";
import Property from '../models/property.models.js'
import Maintenance from '../models/maintenance.model.js'
import TenantPropertyAssignment from '../models/tenant-property-assignment.model.js'


export const createMaintenance = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Authentication is Required",
            });
            return;
        }

        // Verify the tenant's active property assignment before uploading photos or calling AI.
        const selectedProperty = await Property.findById(req.body.propertyId)
            .select("_id isActive");

        if (!selectedProperty || !selectedProperty.isActive) {
            res.status(404).json({
                success: false,
                code: "PROPERTY_NOT_AVAILABLE",
                message: "This property is not available for maintenance requests.",
            });
            return;
        }

        const activeAssignment = await TenantPropertyAssignment.exists({
            tenant: user.userId,
            property: req.body.propertyId,
            status: "ACTIVE",
        });
        if (!activeAssignment) {
            res.status(403).json({
                success: false,
                code: "TENANT_PROPERTY_ACCESS_DENIED",
                message: "You are not assigned to this property.",
            });
            return;
        }

        const files = (req.files ?? []) as Express.Multer.File[];
// Upload photos to Cloudinary.
        const uploadedPhotos = await Promise.all(
            files.map((file) => uploadImage(file.buffer))
        );

        const maintenance = await createMaintenanceReq(
            req.body,
            user.userId
        );

        // Save the uploaded photo URLs.
        if (uploadedPhotos.length > 0) {
            maintenance.photos = uploadedPhotos.map(
                (photo) => photo.secure_url
            );

            await maintenance.save();
        }

        res.status(201).json({
            success: true,
            message: "Maintenance Request Created Successfully",
            data: maintenance,
        });
    } catch (err) {
        console.error("Create maintenance request failed:", err);

        const apiError = err as {
            status?: number;
            message?: string;
        };

        if (err instanceof Error && err.message === "Tenant is not assigned to this property") {
            res.status(403).json({
                success: false,
                code: "TENANT_PROPERTY_ACCESS_DENIED",
                message: "You are not assigned to this property.",
            });
            return;
        }

        if (err instanceof Error && err.message === "Property not found") {
            res.status(404).json({
                success: false,
                message: "Property not found",
            });
            return;
        }

        const errorMessage = apiError.message ?? (
            err instanceof Error ? err.message : ""
        );

        const isGeminiUnavailable =
            apiError.status === 429 ||
            apiError.status === 503 ||
            errorMessage.includes("RESOURCE_EXHAUSTED") ||
            errorMessage.toLowerCase().includes("quota") ||
            errorMessage.toLowerCase().includes("high demand");

        if (isGeminiUnavailable) {
            res.status(503).json({
                success: false,
                code: "AI_SERVICE_BUSY",
                message: "AI is currently busy. Please create your maintenance request later.",
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Failed to create maintenance request. Please try again later.",
        });
    }
};


export const getMaintnence = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }

        const maintenanceReq = await getMaintenanceReq(
            user.userId,
            user.role
        );

        res.status(200).json({
            success: true,
            message: "Maintenance Requests Fetched Successfully",
            data: maintenanceReq
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
export const getMaintenanceById = async(req:Request,res:Response):Promise<void> =>{
    try{
        const user = req.user;
        if(!user){
            res.status(400).json({succes:false,message:'Authentication Required'})
            return;
        }
        const maintenanceId = req.params.id.toString();
        const maintenance = await getMaintenanceReqById(maintenanceId)
        if(user.role === ROLES.Admin){
           res.status(200).json({success:true,data:maintenance})
           return;
        }
        if(user.role === ROLES.Tenant){
            if(maintenance.tenant._id.toString() !== user.userId){
                res.status(403).json({success:false,message:"You are not allowed to View this Content"});
                return;
            }
            res.status(200).json({success:true,data:maintenance})
        }
       if (user.role === ROLES.Manager) {
    const property = await Property.findById(
        maintenance.property
    );

    if (!property || property.manager.toString() !== user.userId) {
        res.status(403).json({
            success: false,
            message: "You are not allowed to view this request",
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: maintenance,
    });
    return;
}
if (user.role === ROLES.Technician) {
    if (
        !maintenance.technician ||
        maintenance.technician._id.toString() !== user.userId
    ) {
        res.status(403).json({
            success: false,
            message: "You are not assigned to this maintenance request",
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: maintenance,
    });
    return;
}
        }

        catch(err){
            if(err instanceof Error && err.message === '"Maintenance request not found'){
                res.status(404).json({
                    success:false,message:'Maintenance reqiest not found'
                })
                return;
            }
            res.status(500).json({success:false,message:"Internal Server Error"})
        }
    }


    export const assignTechnicain=async(req:Request,res:Response):Promise<void> =>{
        try{
            const user = req.user;
            if(!user){
                res.status(401).json({
                    success:false,
                    message:'Aunthentication Required'
                })
                return ;
            }
            const maintenanceId = req.params.id.toString();
            const {technicianId} = req.body;
            const maintenance = await Maintenance.findById(maintenanceId)
            if(!maintenance){
                res.status(401).json({
                    success:false,message:'Maintenance Request Not found'
                })
                return  ;
            }
            const property = await  Property.findById(maintenance.property);
            if(!property || property.manager.toString() !== user.userId){
                 res.status(403).json(
                    {success:false,message:'You are not allowed to assign technician to this request'})
                    return ;
            }
            const updateMaintenance =  await assignTechnicainService(maintenanceId,technicianId)
            res.status(200).json({success:true,message:'Technician assigned SuccessFully',data:updateMaintenance})

        }
        catch(err){
             if (
            err instanceof Error &&
            err.message === "Technician not found"
        ) {
            res.status(404).json({
                success: false,
                message: "Technician not found",
            });
            return;
        }

        if (
            err instanceof Error &&
            err.message === "User is not a technician"
        ) {
            res.status(400).json({
                success: false,
                message: "Selected user is not a technician",
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        }
    }
export const ViewTechnicianReq = async(req:Request,res:Response) =>{
    try{
        const user  = req.user;
        if(!user){
            res.status(401).json({success:false,message:'Aunthentication Required'});
            return ;
        }
        const maintenanceRequests = await ViewTechnicianRequsetService(user.userId)
        res.status(200).json({success:true,message:"Technician Requests Fetched SuccessFully",data:maintenanceRequests})
    }
    catch(err){
        res.status(500).json({success:false,message:'Internal Server Error'})
    }
}
export const updateMaintenanceStatus = async(req:Request,res:Response):Promise<void> =>{
    try{
        const user = req.user;
        if(!user){
            res.status(401).json({
                success:false,message:'Authentication Required'
            })
            return;
        }
        const maintenanceId = req.params.id.toString();
        const { status } = req.body;
        const maintenance = await updateMaintenanceStatusService(maintenanceId,user.userId,status)
        res.status(200).json({
            success:true,message:"Maintenance Status Updated Successfully",data:maintenance
        })
    }
    catch(err){
          if (
            err instanceof Error &&
            err.message === "Maintenance request not found"
        ) {
            res.status(404).json({
                success: false,
                message: "Maintenance request not found"
            });
            return;
        }

        if (
            err instanceof Error &&
            err.message === "You are not assigned to this maintenance request"
        ) {
            res.status(403).json({
                success: false,
                message: "You are not assigned to this maintenance request"
            });
            return;
        }

     

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

}

export const getManagerInsights = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }

        const insights = await getManagerInsightsService(
            user.userId
        );

        res.status(200).json({
            success: true,
            message: "Manager insights generated successfully",
            data: insights
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const recommendTechnician = async(req:Request,res:Response):Promise<void> =>{
    try{
        const maintenaceId = req.params.id.toString();
        const maintenace = await Maintenance.findById(maintenaceId)
        if(!maintenace){
            res.status(404).json({
                success: false,
                message: "Maintenance not found"
            });
            return;
        }
        const property = await Property.findById(maintenace.property);
        if(!property){
            res.status(404).json({
                success: false,
                message: "Property not found"
            });
            return;
        }
        if (!property.location) {
            res.status(400).json({
                success: false,
                message: "Property location not available"
            });
            return;
        }
        const category = maintenace.category
        const priority = maintenace.priority
        if(!category){
            res.status(404).json({
                success: false,
                message: "Category not found"
            });
            return;
        }
        const recommendation = await recommendTechnicians(category,priority,property.location.latitude,property.location.longitude);
        res.status(200).json({
            success:true,data:recommendation
        })

    }
    catch(err){
        res.status(500).json({
            success:false,message:'Internal Server Error'
        })
    }
}
export const detectRecurring = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const maintenance = await Maintenance.findById(req.params.id);

        if (!maintenance) {
            res.status(404).json({
                success: false,
                message: "Maintenance Request Not Found"
            });
            return;
        }

        const result = await detectRecurringMaintenace(
            maintenance.property.toString(),
            maintenance.category
        );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getMaintenanceAlert = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }

        const scope =
            user.role === ROLES.Admin
                ? { mode: "admin" as const }
                : { mode: "manager" as const, managerId: user.userId };

        const alerts = await MaintenanceAlertService(scope);

        res.status(200).json({
            success: true,
            data: alerts
        });
    } catch (err) {
        console.error("Failed to fetch maintenance alerts:", err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

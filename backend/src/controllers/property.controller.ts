import type {Request,Response} from 'express';
import { createProperty, getMyProperties,getPropertyByid as getPropertyByIdService,updateProperty as updatePropertyService,deactivateProperty as deactivatePropertyService,getAvailableProperties,acitivateProperty as activatePropertyService} from '../services/property.service.js';
import { PropertyHealthService } from '../services/property-health.services.js'
import {ROLES} from '../constants/roles.js'
import { ManagerCopilotService } from '../services/manager-copilot.services.js';
import {
    assignTenantToProperty,
    getTenantAssignedProperties,
    endTenantPropertyAssignment,
} from '../services/tenant-property-assignment.service.js';
export const create  =  async(req:Request,res:Response): Promise<void>=>{
    try{ 
        if(!req.user){
             res.status(401).json({
                success:false,
                message:'Unauthorized User'
            })
            return ;
        }
        const property = await createProperty(
            req.body,
            req.user.userId
        );
        res.status(201).json({
            success:true,
            message:'Property Created Successfully',
            data:property
        })
    }
    catch(err){
        res.status(400).json({
            success:false,
            message:'Property Creation Failed',
            error:err
        })
    }

}
export const getProperties = async(req:Request,res:Response):Promise<void> =>{
try{
    const user = req.user;
    if(!user){
        res.status(401).json({
            success:false,
            message:"Authentication is Required"
        })
        return ;
    }
    const managerId = user.userId
    const properties = await getMyProperties(managerId)
    res.status(200).json({success:true,message:'Properties Fetched SuccessFully',data:properties});
}
catch(err){
    res.status(500).json({
        success:false,message:'Internal Server Error'
    })
}
}
export const getPropertyById = async(req:Request,res:Response):Promise<void> =>{
    try{
        const user = req.user;

        if(!user){
            res.status(401).json({
                success:false,message:"Authentication is Required"
            })
            return;
        }
        const propertyid = req.params.id.toString();
        const property = await getPropertyByIdService(propertyid)
    if(user.role === ROLES.Admin){
        res.status(200).json({success:true,data:property})
        return;
    }
    if(property.manager.toString() !== user.userId){
        res.status(403).json({
            success:false,
            message:"You are not allowed to view this Property"
        })
        return ;
    }
    res.status(200).json({
        success:true,data:property
    })
    }
    catch(err){
        if(err instanceof Error &&  err.message === "Property not found")
        {
             res.status(404).json({
                success:false,message:"Property not found"
            })
            return ;
        }

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
export const getAvailablePropertiesList = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }
        const properties = await getAvailableProperties(req.user.userId);

        res.status(200).json({
            success: true,
            message: "Available properties fetched successfully",
            data: properties
        });
    } catch (error) {
        console.error("Failed to fetch available properties:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch available properties"
        });
    }
};
export const updateProperty =async (req:Request,res:Response):Promise<void> =>{
    try{
        const user  =req.user;
        if(!user){
            res.status(401).json({
                success:false,
                message:'Authentication Required'
            });
          return;    
        }
          const propertyId = req.params.id.toString()
            const property = await getPropertyByIdService(propertyId);
            if(user.role !== ROLES.Admin){
                if(property.manager.toString() !== user.userId){
                    res.status(403).json({
                        success:false,
                        message:"You are not allowed to do this operation"
                    })
                    return;
                }
            }
            const updatedProperty = await updatePropertyService(propertyId,req.body)
            res.status(200).json({success:true,message:"Property updatedSuccessFully",data:updatedProperty})
    }catch(err){
        if(err instanceof Error && err.message === "Property not found"){
            res.status(404).json({
                success:false,message:'Property not found'
            });
            return ;
        }
        res.status(500).json({
            success:false,message:'Internal Server Error'
        });
    }
};
export const deactivateProperty = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const id = String(req.params.id);
        const property = await getPropertyByIdService(id);

        if (
            req.user.role !== ROLES.Admin &&
            property.manager.toString() !== req.user.userId
        ) {
            res.status(403).json({
                success: false,
                message: "You are not allowed to deactivate this property",
            });
            return;
        }

        const deactivatedProperty = await deactivatePropertyService(id);

        res.status(200).json({
            success: true,
            message: "Property deactivated successfully",
            data: deactivatedProperty,
        });
    } catch (error) {
        console.error("Deactivate property error:", error);

        const message =
            error instanceof Error ? error.message : "Internal Server Error";

        if (
            message === "Property Not Found" ||
            message === "Property not found"
        ) {
            res.status(404).json({
                success: false,
                message: "Property Not Found",
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Failed to deactivate property",
        });
    }
};
export const activateProperty =async (req:Request,res:Response):Promise<void> => {
    try{
        if(!req.user){
             res.status(401).json({
                success:false,
                message:"UnAuthorized"
            })
            return;
        }
        const propertyid = req.params.id.toString();
        const property = await getPropertyByIdService(propertyid);
        if(req.user.role !== ROLES.Admin  && property.manager.toString() !== req.user.userId){
             res.status(403).json({
                success:false,
                message:"You are not allowed to activate this Property"
            })
            return;
        }
        const activatetheProperty = await activatePropertyService(propertyid);
        res.status(200).json({
            success:true,message:'Property Activated SuccessFully',
            data:activatetheProperty
        })
    }
   catch (error) {
    console.error("Activate property error:", error);

    const message =
        error instanceof Error ? error.message : "Internal Server Error";

    if (
        message === "Property Not Found" ||
        message === "Property not found"
    ) {
        res.status(404).json({
            success: false,
            message: "Property Not Found",
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: "Failed to Activate Property",
    });
}
    }

    

export const getPropertyHealth = async(req:Request,res:Response):Promise<void> =>{
    try{
        const propertyId = req.params.id.toString();
        if(!req.user){
            res.status(401).json({
                success:false,
                message:'Unauthorized User'
            });
            return ;
        }
        const health = await PropertyHealthService(propertyId);
        res.status(200).json({success:true,data:health});
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:'Internal Server Error'
        });
    }
}
export const ManagerCopilot = async(req:Request,res:Response):Promise<void> =>{
    try{
        const propertyId = req.params.id.toString();
        const analysis = await ManagerCopilotService(propertyId);
        res.status(200).json({success:true,data:analysis});
    }catch(err){
        console.log(err)
        res.status(500).json({
            success:false,message:"Internal Server Error"
        })  
    }
}

export const assignTenant = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }

        const propertyId = String(req.params.id);
        const property = await getPropertyByIdService(propertyId);

        if (user.role !== ROLES.Admin && property.manager.toString() !== user.userId) {
            res.status(403).json({ success: false, message: "You cannot manage tenants for this property" });
            return;
        }

        const assignment = await assignTenantToProperty(
            propertyId,
            req.body.tenantId,
            user.userId
        );

        res.status(201).json({
            success: true,
            message: "Tenant assigned to property successfully",
            data: assignment,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message === "Property not found") {
            res.status(404).json({ success: false, message });
            return;
        }
        if (
            message === "Property not found or inactive" ||
            message === "An active tenant account is required"
        ) {
            res.status(400).json({ success: false, message });
            return;
        }
        if (message === "Tenant is already assigned to this property") {
            res.status(409).json({ success: false, message });
            return;
        }
        console.error("Assign tenant failed:", error);
        res.status(500).json({ success: false, message: "Failed to assign tenant" });
    }
};

export const getMyAssignedProperties = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }
        const assignments = await getTenantAssignedProperties(req.user.userId);
        res.status(200).json({
            success: true,
            message: "Assigned properties fetched successfully",
            data: assignments,
        });
    } catch (error) {
        console.error("Fetch tenant properties failed:", error);
        res.status(500).json({ success: false, message: "Failed to fetch assigned properties" });
    }
};

export const endTenantAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }

        const propertyId = String(req.params.id);
        const tenantId = String(req.params.tenantId);
        const property = await getPropertyByIdService(propertyId);

        if (user.role !== ROLES.Admin && property.manager.toString() !== user.userId) {
            res.status(403).json({ success: false, message: "You cannot manage tenants for this property" });
            return;
        }

        const assignment = await endTenantPropertyAssignment(propertyId, tenantId);
        res.status(200).json({
            success: true,
            message: "Tenant property assignment ended successfully",
            data: assignment,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message === "Property not found" || message === "Active tenant assignment not found") {
            res.status(404).json({ success: false, message });
            return;
        }
        console.error("End tenant assignment failed:", error);
        res.status(500).json({ success: false, message: "Failed to end tenant assignment" });
    }
};

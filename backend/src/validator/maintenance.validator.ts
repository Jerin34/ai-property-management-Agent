import { z} from 'zod'
export const createMaintenanceSchema = z.object({
    propertyId:z.string().min(1,"Property ID is required"),
    title:z.string().min(3,"Title must be atleast 3 charecters").max(100,"Title must be less than 100 words"),
    description:z.string().min(10,"Description must be atleast 10 characters").max(1000,"Description must be less than 1000 words")

});
export const AssignTechnicianSchema = z.object({
    technicianId:z.string().min(1,'Technician id is required')
    
})
export const UpdatesTechnicianStatusSchema = z.object({
    status:z.enum(['IN_PROGRESS','COMPLETED'])
})
export const MaintenanceupdateSchema = z.object({
    message:z.string().min(10,"Message must be atleast 10 characters").max(500,"Message must be less than 1000 words")
})
export type createMaintenanceInput = z.infer< typeof createMaintenanceSchema >;
export type AssignTechnicianInput = z.infer< typeof AssignTechnicianSchema>;
export type UpdatesTechnicianStatusInput = z.infer<typeof UpdatesTechnicianStatusSchema>;
export type MaintenanceupdateInput = z.infer<typeof MaintenanceupdateSchema>;
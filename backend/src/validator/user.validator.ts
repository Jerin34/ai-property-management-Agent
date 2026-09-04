import {z} from 'zod';
import {ROLES } from '../constants/roles.js'
import { TECHNICIAN_SKILLS } from '../constants/technician.constants.js';
export const updateUserSchema = z.object({
    role:z.enum([
        ROLES.Admin,
        ROLES.Tenant,
        ROLES.Manager,
        ROLES.Technician
    ])
    
})
export const updateTechnicianSkillsSchema = z.object({
    skills:z.array(z.enum(Object.values(TECHNICIAN_SKILLS) as [string,...string[]])).min(1,"Atleast 1 skill is required")
})
export const updateLocationSchema = z.object({
    latitude:z.number(),
    longitude:z.number(),
})
 
export type UpdateUserRoleInput = z.infer<typeof updateUserSchema>;
export type UpdateTechnicianSkillsInput = z.infer<typeof updateTechnicianSkillsSchema>;

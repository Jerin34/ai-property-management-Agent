import {z} from 'zod';
import {ROLES } from '../constants/roles.js'
export const updateUserSchema = z.object({
    role:z.enum([
        ROLES.Admin,
        ROLES.Tenant,
        ROLES.Manager,
        ROLES.Technician
    ])
})
export type UpdateUserRoleInput = z.infer<typeof updateUserSchema>;

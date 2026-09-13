import {z} from 'zod';
export const createNotificationSchema = z.object({
    recipient:z.string(),
    maintenanceId:z.string().optional(),
    propertyId: z.string().optional(),
    type:z.enum(['MAINTENANCE_ASSIGNED','MAINTENANCE_UPDATED','MAINTENANCE_COMPLETED','EMERGENCY_MAINTENANCE','HIGH_PRIORITY_UNRESOLVED','LOW_PROPERTY_HEALTH','MAINTENANCE_BACKLOG','MAINTENANCE_ESCALATED']),
    severity:z.enum(['LOW','MEDIUM','HIGH','CRITICAL']),
    title:z.string(),
    message:z.string(),
    isRead:z.boolean()
});
export type createNotificationInput = z.infer<typeof createNotificationSchema>;
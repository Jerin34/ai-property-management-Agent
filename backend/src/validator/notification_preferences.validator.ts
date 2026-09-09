import {z} from 'zod'

export const updateNotificationPreferenceSchema = z.object({
    emergencyMaintenance: z.boolean().optional(),

    highPriorityUnresolved: z.boolean().optional(),

    lowPropertyHealth: z.boolean().optional(),

    maintenanceBacklog: z.boolean().optional()
});
export type updateNotificationPreferencesInput  = z.infer<typeof updateNotificationPreferenceSchema>


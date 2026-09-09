import { z } from "zod";

export const createMaintenanceScheduleSchema = z.object({
    property: z.string().min(1),

    title: z.string().min(1),

    description: z.string().optional(),

    category: z.enum([
        "PLUMBING",
        "ELECTRICAL",
        "HVAC",
        "APPLIANCE",
        "STRUCTURAL",
        "OTHER"
    ]),

    frequency: z.enum([
        "DAILY",
        "WEEKLY",
        "MONTHLY",
        "QUARTERLY",
        "YEARLY"
    ]),

    nextDueDate: z.coerce.date(),

    isActive: z.boolean().optional()
});

export type CreateMaintenanceScheduleInput =
    z.infer<typeof createMaintenanceScheduleSchema>;
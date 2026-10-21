import { z } from "zod";

export const createMaintenanceScheduleSchema = z.object({
    property: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid property ID"
}),
   title: z.string().trim().min(1, {
    message: "Title is required"
}),

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
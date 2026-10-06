import { z } from "zod";

export const updateMaintenanceCostSchema = z.object({
    laborCost: z.number().min(0).optional(),
    materialCost: z.number().min(0).optional()
}).refine(
    data => data.laborCost !== undefined || data.materialCost !== undefined,
    {
        message: "At least one cost value is required"
    }
);

export type UpdateMaintenanceCostInput =
    z.infer<typeof updateMaintenanceCostSchema>;

import { z } from "zod";

export const updateMaintenanceCostSchema = z.object({

    estimatedCost:
        z.number()
            .min(0)
            .optional(),

    actualCost:
        z.number()
            .min(0)
            .optional(),

    laborCost:
        z.number()
            .min(0)
            .optional(),

    materialCost:
        z.number()
            .min(0)
            .optional()

});

export type UpdateMaintenanceCostInput =
    z.infer<typeof updateMaintenanceCostSchema>;
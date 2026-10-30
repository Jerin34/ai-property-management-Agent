import { z } from "zod";

export const assignTenantSchema = z.object({
    tenantId: z.string().regex(/^[a-fA-F0-9]{24}$/, "A valid tenant ID is required"),
});

import { z } from "zod";

export const assignTenantSchema = z.object({
    tenantEmail: z.string().trim().email("A valid tenant email is required").toLowerCase(),
});

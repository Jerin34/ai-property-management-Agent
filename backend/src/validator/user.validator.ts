import { z } from "zod";
import { ROLES } from "../constants/roles.js";
import { TECHNICIAN_SKILLS } from "../constants/technician.constants.js";

export const updateUserSchema = z.object({
  role: z.enum([
    ROLES.Admin,
    ROLES.Tenant,
    ROLES.Manager,
    ROLES.Technician,
  ]),
});

export const updateTechnicianSkillsSchema = z.object({
  skills: z
    .array(z.enum(Object.values(TECHNICIAN_SKILLS) as [string, ...string[]]))
    .min(1, "At least one skill is required"),
});

export const updateLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const updateTechnicianProfileSchema = z.object({
  skills: z
    .array(z.enum(Object.values(TECHNICIAN_SKILLS) as [string, ...string[]]))
    .min(1, "Select at least one skill"),
  experienceYears: z.number().min(0).max(60),
  serviceAreas: z
    .array(z.string().trim().min(2).max(100))
    .min(1, "Add at least one service area")
    .max(10),
  availability: z.enum(["FULL_TIME", "PART_TIME", "FLEXIBLE"]),
  workingHours: z.object({
    start: z.string().regex(timePattern, "Use 24-hour HH:MM format"),
    end: z.string().regex(timePattern, "Use 24-hour HH:MM format"),
  }),
  bio: z.string().trim().max(500).optional(),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserSchema>;
export type UpdateTechnicianSkillsInput = z.infer<
  typeof updateTechnicianSkillsSchema
>;
export type UpdateTechnicianProfileInput = z.infer<
  typeof updateTechnicianProfileSchema
>;

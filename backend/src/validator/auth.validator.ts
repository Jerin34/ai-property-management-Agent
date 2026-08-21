import {z} from 'zod';
export const registerSchema  = z.object({
    name:z
    .string()
    .trim()
    .min(2, 'there must be atlreast to Characters'),
    email:z
    .string()
    .trim()
    .email('please provide a valid email address'),
    password:z
    .string()
    .min(8,'password must be at least 8 characters long'),
    phone:z
    .string()
    .trim()
    .min(10,'please provide a valid phone number')
    .max(15,'phone number must not be longer than 15 characters')
    .optional(),
})

export const loginSchema = z.object({
    email:z.string().trim().email('please provide a valid email address'),
    password:z.string().min(1,'Password is required')
})

export type RegisterInput = z.infer<typeof registerSchema>;
export type loginInput = z.infer<typeof loginSchema>;

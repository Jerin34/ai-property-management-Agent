import {z} from 'zod'
export type createPropertyInput = z.infer<typeof createPropertySchema>
export type updatePropertyInput  = z.infer<typeof updatePropertySchema>
export const createPropertySchema = z.object({
    name:z.string().min(2,'Property name must be atleast 2 charecters').max(150,'Property name must be less than 150 charecters '),
    address:z.object({
        street:z.string().min(2,'Street must be atleast 2 charecters'),
        city:z.string().min(2,'City must be atleast 2 charecters'),
        state:z.string().min(2,'State must be atleast 2 charecters'),
        postalcode:z.string().min(2,'Postal Code must be atleast 2 charecters'),
        country:z.string().min(2,'Country must be atleast 2 charecters'),
    }),
    description:z.string().max(500,'Description must be less than 500 charecters').trim().optional(),


})
export const updatePropertySchema = createPropertySchema.partial()

import { z } from 'zod'

const createServiceZSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    price: z.number(),
    status: z.enum(['active', 'inactive', 'upcoming']).default('active'),
    category: z.enum(['Wedding', 'Birthday', 'Anniversary', 'Others']),
  }),
})

const updateServiceZSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    price: z.number().optional(),
    status: z
      .enum(['active', 'inactive', 'upcoming'])
      .default('active')
      .optional(),
    category: z
      .enum(['Wedding', 'Birthday', 'Anniversary', 'Others'])
      .optional(),
  }),
})

export const ServiceValidation = {
  createServiceZSchema,
  updateServiceZSchema,
}

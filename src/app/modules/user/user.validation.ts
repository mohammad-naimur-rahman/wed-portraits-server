import { z } from 'zod'

const updateUserZSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    image: z.string().optional(),
  }),
})

export const UserValidation = {
  updateUserZSchema,
}

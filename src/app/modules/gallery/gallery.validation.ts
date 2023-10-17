import { z } from 'zod'

const createGallaryZSchema = z.object({
  body: z.object({
    image: z.string(),
    date: z.coerce.date(),
  }),
})

const updateGallaryZSchema = z.object({
  body: z.object({
    image: z.string().optional(),
    date: z.coerce.date().optional(),
  }),
})

export const GalleryValidation = {
  createGallaryZSchema,
  updateGallaryZSchema,
}

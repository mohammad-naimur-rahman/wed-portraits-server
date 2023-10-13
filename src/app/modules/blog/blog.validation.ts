import { z } from 'zod'

const createBlogZSchema = z.object({
  body: z.object({
    title: z.string(),
    content: z.string(),
    image: z.string().optional(),
    tags: z.string().array(),
  }),
})

const updateBlogZSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    image: z.string().optional(),
    tags: z.string().array().optional(),
  }),
})

export const BlogValidation = {
  createBlogZSchema,
  updateBlogZSchema,
}

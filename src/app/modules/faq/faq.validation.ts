import { z } from 'zod'

const createFaqZSchema = z.object({
  body: z.object({
    question: z.string(),
    answer: z.string(),
  }),
})

const updateFaqZSchema = z.object({
  body: z.object({
    question: z.string().optional(),
    answer: z.string().optional(),
  }),
})

export const FaqValidation = {
  createFaqZSchema,
  updateFaqZSchema,
}

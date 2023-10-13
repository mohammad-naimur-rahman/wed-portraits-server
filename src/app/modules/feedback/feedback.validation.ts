import { z } from 'zod'

const createFeedbackZSchema = z.object({
  body: z.object({
    topic: z.string(),
    description: z.string().optional(),
  }),
})

export const FeedbackValidation = {
  createFeedbackZSchema,
}

import { z } from 'zod'

const createReviewZSchema = z.object({
  body: z.object({
    reviewText: z.string(),
    rating: z.number().min(1).max(5),
    service: z.string(),
  }),
})

export const ReviewValidation = {
  createReviewZSchema,
}

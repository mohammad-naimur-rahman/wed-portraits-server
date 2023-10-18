import { z } from 'zod'

const createBookingZSchema = z.object({
  body: z.object({
    service: z.string(),
    date: z.coerce.date(),
    status: z
      .enum(['pending', 'confirmed', 'cancelled', 'ongoing', 'fulfilled'])
      .default('pending'),
  }),
})

const updateBookingZSchema = z.object({
  body: z.object({
    service: z.string().optional(),
    date: z.coerce.date().optional(),
    status: z
      .enum(['pending', 'confirmed', 'cancelled', 'ongoing', 'fulfilled'])
      .default('pending')
      .optional(),
  }),
})

export const BookingValidation = {
  createBookingZSchema,
  updateBookingZSchema,
}

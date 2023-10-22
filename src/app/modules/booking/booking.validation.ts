import { z } from 'zod'

const createBookingZSchema = z.object({
  body: z.array(
    z.object({
      service: z.object({
        title: z.string(),
        description: z.string(),
        image: z.string().optional(),
        price: z.number(),
        status: z.enum(['active', 'inactive', 'upcoming']).default('active'),
        category: z.enum(['Wedding', 'Birthday', 'Anniversary', 'Others']),
      }),
      date: z.coerce.date(),
      status: z
        .enum(['pending', 'confirmed', 'cancelled', 'ongoing', 'fulfilled'])
        .default('pending'),
    })
  ),
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

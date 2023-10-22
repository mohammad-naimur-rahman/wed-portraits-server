import { Types } from 'mongoose'
import config from '../../../config'
import { stripe } from '../../../lib/stripe'
import { IService } from '../service/service.interface'
import { IBookingService } from './payment.interface'
import { Payment } from './payment.model'

const proceedToPayment = async (payload: {
  services: IBookingService[]
  user: string
}): Promise<string> => {
  const lineItems = payload.services.map((booking: IBookingService) => {
    const images = [(booking.service as unknown as IService).image].filter(
      Boolean
    )

    return {
      price_data: {
        currency: 'usd',
        unit_amount: (booking.service as unknown as IService).price * 100,
        product_data: {
          name: (booking.service as unknown as IService).title,
          description: `Booked for date - ${new Date(
            booking.date
          ).toLocaleDateString()}`,
          images: images as string[],
        },
      },
      quantity: 1,
    }
  })

  const services: IBookingService[] = payload.services.map(item => {
    return {
      service: new Types.ObjectId(item.service.id),
      date: item.date,
    }
  })

  const paymentInit = await Payment.create({
    services,
    user: payload.user,
    status: 'pending',
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${config.fe_host}/success-payment`,
    cancel_url: `${config.fe_host}/cancel-payment`,
    metadata: {
      id: paymentInit._id.toString(),
    },
  })

  return session.id
}

export const PaymentService = { proceedToPayment }

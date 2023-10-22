import { Schema, model } from 'mongoose'
import { IBookingService, IPayment, PaymentModel } from './payment.interface'

const BookingServiceSchema = new Schema<IBookingService>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      reqruied: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    id: false,
  }
)

const PaymentSchema = new Schema<IPayment, PaymentModel>(
  {
    services: {
      type: [BookingServiceSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'cancelled'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

export const Payment = model<IPayment, PaymentModel>('Payment', PaymentSchema)

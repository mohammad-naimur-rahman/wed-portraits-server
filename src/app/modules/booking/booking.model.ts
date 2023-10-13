import { model, Schema } from 'mongoose'
import { bookingStatusArr } from './booking.constants'
import { BookingModel, IBooking } from './booking.interface'

const BookingSchema = new Schema<IBooking, BookingModel>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: bookingStatusArr,
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

export const Booking = model<IBooking, BookingModel>('Booking', BookingSchema)

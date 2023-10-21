import { Model, Types } from 'mongoose'

type Status = 'pending' | 'confirmed' | 'cancelled' | 'ongoing' | 'fulfilled'

export interface IBooking {
  service: Types.ObjectId
  user: Types.ObjectId
  date: Date
  status: Status
}

export type BookingModel = Model<IBooking, Record<string, unknown>>

export interface IBookingQuery {
  user?: string
  status?: Status | 'all'
}

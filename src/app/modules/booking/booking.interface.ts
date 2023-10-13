import { Model, Types } from 'mongoose'

export interface IBooking {
  service: Types.ObjectId
  user: Types.ObjectId
  date: Date
  status: 'pending' | 'confirmed' | 'cancelled' | 'ongoing' | 'fulfilled'
}

export type BookingModel = Model<IBooking, Record<string, unknown>>

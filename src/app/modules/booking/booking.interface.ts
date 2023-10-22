import { Model, Types } from 'mongoose'
import { IService } from '../service/service.interface'

type Status = 'pending' | 'confirmed' | 'cancelled' | 'ongoing' | 'fulfilled'

export interface IBooking {
  service: Types.ObjectId | IService
  user: Types.ObjectId
  date: Date
  status: Status
}

export type BookingModel = Model<IBooking, Record<string, unknown>>

export interface IBookingQuery {
  user?: string
  status?: Status | 'all'
}

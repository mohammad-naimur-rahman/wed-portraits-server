import { Model, Types } from 'mongoose'

export interface IBookingService {
  service: Types.ObjectId
  date: Date
}

export interface IPayment {
  status: 'pending' | 'fulfilled' | 'cancelled'
  services: IBookingService[]
  user: Types.ObjectId
}

export type PaymentModel = Model<IPayment, Record<string, unknown>>

import { Model, Types } from 'mongoose'

export interface IUser {
  name: string
  email: string
  password: string
  image?: string
  role: 'user' | 'admin' | 'super_admin'
  bookings: Types.ObjectId[]
}

export type UserModel = Model<IUser, Record<string, unknown>>

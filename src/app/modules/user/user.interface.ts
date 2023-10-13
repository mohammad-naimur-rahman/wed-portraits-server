import { Model, Types } from 'mongoose'
import { ENUM_USER_ROLE } from '../../../enums/user'

export interface IUser {
  name: string
  email: string
  password: string
  image?: string
  role: keyof typeof ENUM_USER_ROLE
  bookings: Types.ObjectId[]
}

export type UserModel = Model<IUser, Record<string, unknown>>

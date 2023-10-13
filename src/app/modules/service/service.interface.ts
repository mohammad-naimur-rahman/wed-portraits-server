import { Model, Types } from 'mongoose'

export interface IService {
  title: string
  description: string
  image?: string
  price: number
  status: 'active' | 'inactive' | 'upcoming'
  category: 'Wedding' | 'Birthday' | 'Anniversary' | 'Others'
  reviews: Types.ObjectId[]
}

export type ServiceModel = Model<IService, Record<string, unknown>>

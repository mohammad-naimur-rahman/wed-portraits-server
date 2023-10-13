import { Model, Types } from 'mongoose'
import { serviceCategoryArray } from './service.constants'

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

export interface IServiceFilters {
  search: string
  title: string
  price: number
  category: typeof serviceCategoryArray
}

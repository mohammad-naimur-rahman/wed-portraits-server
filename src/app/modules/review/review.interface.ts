import { Model, Types } from 'mongoose'

export interface IReview {
  reviewText: string
  rating: number
  user: Types.ObjectId
  service: Types.ObjectId
}

export type ReviewModel = Model<IReview, Record<string, unknown>>

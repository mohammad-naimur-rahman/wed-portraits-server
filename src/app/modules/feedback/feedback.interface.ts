import { Model, Types } from 'mongoose'

export interface IFeedback {
  topic: string
  description?: string
  user: Types.ObjectId
}

export type FeedbackModel = Model<IFeedback, Record<string, unknown>>

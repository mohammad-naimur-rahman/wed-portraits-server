import { Schema, model } from 'mongoose'
import { FeedbackModel, IFeedback } from './feedback.interface'

const FeedbackSchema = new Schema<IFeedback, FeedbackModel>(
  {
    topic: {
      type: String,
      required: true,
    },
    description: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

export const Feedback = model<IFeedback, FeedbackModel>(
  'Feedback',
  FeedbackSchema
)

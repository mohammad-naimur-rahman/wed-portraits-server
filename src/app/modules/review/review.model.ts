import { Schema, model } from 'mongoose'
import { IReview, ReviewModel } from './review.interface'

const ReviewSchema = new Schema<IReview, ReviewModel>(
  {
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

export const Review = model<IReview, ReviewModel>('Review', ReviewSchema)

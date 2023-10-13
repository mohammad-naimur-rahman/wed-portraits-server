import { Schema, model } from 'mongoose'
import { serviceCategoryArray } from './service.constants'
import { IService, ServiceModel } from './service.interface'

const ServiceSchema = new Schema<IService, ServiceModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: String,
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'upcoming'],
      default: 'active',
    },
    category: {
      type: String,
      enum: serviceCategoryArray,
      required: true,
    },
    reviews: {
      type: [Schema.Types.ObjectId],
      ref: 'Review',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

export const Service = model<IService, ServiceModel>('Service', ServiceSchema)

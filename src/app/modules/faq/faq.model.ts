import { Schema, model } from 'mongoose'
import { FaqModel, IFaq } from './faq.interface'

const FaqSchema = new Schema<IFaq, FaqModel>(
  {
    question: {
      type: String,
      requried: true,
    },
    answer: {
      type: String,
      requried: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

export const Faq = model<IFaq, FaqModel>('Faq', FaqSchema)

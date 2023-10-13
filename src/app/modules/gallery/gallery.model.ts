import { Schema, model } from 'mongoose'
import { GalleryModel, IGallery } from './gallery.interface'

const GallerySchema = new Schema<IGallery, GalleryModel>(
  {
    image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
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

export const Gallery = model<IGallery, GalleryModel>('Gallery', GallerySchema)

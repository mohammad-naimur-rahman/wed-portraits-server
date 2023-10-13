import { Model } from 'mongoose'

export interface IGallery {
  image: string
  date: Date
}

export type GalleryModel = Model<IGallery, Record<string, unknown>>

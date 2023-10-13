import { Model } from 'mongoose'

export interface IBlog {
  title: string
  slug: string
  content: string
  image?: string
  tags: string[]
}

export type BlogModel = Model<IBlog, Record<string, unknown>>

import { Schema, model } from 'mongoose'
import slugify from 'slugify'
import { BlogModel, IBlog } from './blog.interface'

const BlogSchema = new Schema<IBlog, BlogModel>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: false,
      index: {
        unique: true,
      },
    },
    content: {
      type: String,
      required: true,
    },
    image: String,
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

// Generating automatic slug from the title
// eslint-disable-next-line func-names
BlogSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { replacement: '-', lower: true, trim: true })
  next()
})

export const Blog = model<IBlog, BlogModel>('Blog', BlogSchema)

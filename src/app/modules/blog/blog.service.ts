import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IBlog } from './blog.interface'
import { Blog } from './blog.model'

const createBlog = async (payload: IBlog): Promise<IBlog | null> => {
  const createdBlog = await Blog.create(payload)
  return createdBlog
}

const getAllBlogs = async (query: { limit?: number }): Promise<IBlog[]> => {
  const allBlogs = await Blog.find().limit(query?.limit || 100)
  return allBlogs
}

const getBlog = async (slug: string): Promise<IBlog | null> => {
  const singleBlog = await Blog.findOne({ slug })

  if (!singleBlog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found')
  }

  return singleBlog
}

const updateBlog = async (
  id: string,
  payload: Partial<IBlog>
): Promise<IBlog | null> => {
  const updatedBlog = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedBlog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found')
  }

  return updatedBlog
}

const deleteBlog = async (id: string): Promise<null> => {
  const deletedBlog = await Blog.findByIdAndDelete(id)

  if (!deletedBlog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found')
  }

  return null
}

export const BlogService = {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
}

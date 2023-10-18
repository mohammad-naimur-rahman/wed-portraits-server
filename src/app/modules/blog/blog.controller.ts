import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IBlog } from './blog.interface'
import { BlogService } from './blog.service'

const createBlog = catchAsync(async (req, res) => {
  const createdBlog = await BlogService.createBlog(req.body)
  sendResponse<IBlog>(res, {
    statusCode: httpStatus.CREATED,
    data: createdBlog,
    message: 'Blog created successfully!',
  })
})

const getALllBlogs = catchAsync(async (req, res) => {
  const allBlogs = await BlogService.getAllBlogs(req.query)
  sendResponse<IBlog[]>(res, {
    statusCode: httpStatus.OK,
    data: allBlogs,
    message: 'All Blogs retrieved successfully!',
  })
})

const getBlog = catchAsync(async (req, res) => {
  const singleBlog = await BlogService.getBlog(req.params.slug)
  sendResponse<IBlog>(res, {
    statusCode: httpStatus.OK,
    data: singleBlog,
    message: 'Blog retrieved successfully!',
  })
})

const updateBlog = catchAsync(async (req, res) => {
  const {
    params: { id },
    body,
  } = req
  const updatedBlog = await BlogService.updateBlog(id, body)
  sendResponse<IBlog>(res, {
    statusCode: httpStatus.OK,
    data: updatedBlog,
    message: 'Blog updated successfully!',
  })
})

const deleteBlog = catchAsync(async (req, res) => {
  const deltedBlog = await BlogService.deleteBlog(req.params.id)
  sendResponse<IBlog>(res, {
    statusCode: httpStatus.NO_CONTENT,
    data: deltedBlog,
    message: 'Blog deleted successfully!',
  })
})

export const BlogController = {
  createBlog,
  getALllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
}

import httpStatus from 'http-status'
import { RequestWithUser } from '../../../interfaces/common'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IReview } from './review.interface'
import { ReviewService } from './review.service'

const createReview = catchAsync(async (req, res) => {
  const createdReview = await ReviewService.createReview(
    req.body,
    (req as RequestWithUser).user
  )
  sendResponse<IReview>(res, {
    statusCode: httpStatus.CREATED,
    data: createdReview,
    message: 'Review created successfully!',
  })
})

const getALllReviews = catchAsync(async (req, res) => {
  const allReviews = await ReviewService.getAllReviews(
    (req as RequestWithUser).user
  )
  sendResponse<IReview[]>(res, {
    statusCode: httpStatus.OK,
    data: allReviews,
    message: 'All Reviews retrieved successfully!',
  })
})

const getReview = catchAsync(async (req, res) => {
  const singleReview = await ReviewService.getReview(req.params.id)
  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK,
    data: singleReview,
    message: 'Review retrieved successfully!',
  })
})

const deleteReview = catchAsync(async (req, res) => {
  const deltedReview = await ReviewService.deleteReview(req.params.id)
  sendResponse<IReview>(res, {
    statusCode: httpStatus.NO_CONTENT,
    data: deltedReview,
    message: 'Review deleted successfully!',
  })
})

export const ReviewController = {
  createReview,
  getALllReviews,
  getReview,
  deleteReview,
}

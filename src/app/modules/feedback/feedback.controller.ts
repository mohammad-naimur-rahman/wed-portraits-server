import httpStatus from 'http-status'
import { RequestWithUser } from '../../../interfaces/common'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IFeedback } from './feedback.interface'
import { FeedbackService } from './feedback.service'

const createFeedback = catchAsync(async (req, res) => {
  const createdFeedback = await FeedbackService.createFeedback(
    req.body,
    (req as RequestWithUser).user
  )
  sendResponse<IFeedback>(res, {
    statusCode: httpStatus.CREATED,
    data: createdFeedback,
    message: 'Feedback created successfully!',
  })
})

const getALllFeedbacks = catchAsync(async (req, res) => {
  const allFeedbacks = await FeedbackService.getAllFeedbacks()
  sendResponse<IFeedback[]>(res, {
    statusCode: httpStatus.OK,
    data: allFeedbacks,
    message: 'All Feedbacks retrieved successfully!',
  })
})

const getFeedback = catchAsync(async (req, res) => {
  const singleFeedback = await FeedbackService.getFeedback(req.params.id)
  sendResponse<IFeedback>(res, {
    statusCode: httpStatus.OK,
    data: singleFeedback,
    message: 'Feedback retrieved successfully!',
  })
})

const deleteFeedback = catchAsync(async (req, res) => {
  const deltedFeedback = await FeedbackService.deleteFeedback(req.params.id)
  sendResponse<IFeedback>(res, {
    statusCode: httpStatus.NO_CONTENT,
    data: deltedFeedback,
    message: 'Feedback deleted successfully!',
  })
})

export const FeedbackController = {
  createFeedback,
  getALllFeedbacks,
  getFeedback,
  deleteFeedback,
}

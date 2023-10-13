import httpStatus from 'http-status'
import { JwtPayload } from 'jsonwebtoken'
import ApiError from '../../../errors/ApiError'
import { IFeedback } from './feedback.interface'
import { Feedback } from './feedback.model'

const createFeedback = async (
  payload: IFeedback,
  user: JwtPayload
): Promise<IFeedback | null> => {
  const createdFeedback = await Feedback.create({
    ...payload,
    user: user.userId,
  })
  return createdFeedback
}

const getAllFeedbacks = async (): Promise<IFeedback[]> => {
  const allFeedbacks = await Feedback.find().populate('user')
  return allFeedbacks
}

const getFeedback = async (id: string): Promise<IFeedback | null> => {
  const singleFeedback = await Feedback.findById(id).populate('user')

  if (!singleFeedback) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found')
  }

  return singleFeedback
}

const deleteFeedback = async (id: string): Promise<null> => {
  const deletedFeedback = await Feedback.findByIdAndDelete(id)

  if (!deletedFeedback) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found')
  }

  return null
}

export const FeedbackService = {
  createFeedback,
  getAllFeedbacks,
  getFeedback,
  deleteFeedback,
}

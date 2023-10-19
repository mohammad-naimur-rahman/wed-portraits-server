import httpStatus from 'http-status'
import { JwtPayload } from 'jsonwebtoken'
import { startSession } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { Service } from '../service/service.model'
import { IReview } from './review.interface'
import { Review } from './review.model'

const createReview = async (
  payload: IReview,
  user: JwtPayload
): Promise<IReview | null> => {
  const session = await startSession()

  try {
    session.startTransaction()

    // Creating review
    const createdReview = await Review.create(
      [{ ...payload, user: user.userId }],
      {
        session,
      }
    )

    await createdReview[0].populate('user')

    // Adding review to the specific service reviews array
    await Service.updateOne(
      { _id: payload.service },
      {
        $push: { reviews: createdReview[0]._id },
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    )

    await session.commitTransaction()

    return createdReview[0]
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const getAllReviews = async (user: JwtPayload): Promise<IReview[]> => {
  const isAdmin = user.role === 'admin' || user.role === 'super_admin'

  const findQuery = isAdmin ? {} : { user: user.userId }

  const allReviews = await Review.find(findQuery)
    .populate('user')
    .populate('service')
  return allReviews
}

const getTestimonials = async (): Promise<IReview[]> => {
  const testimonials = await Review.find().limit(5).populate('user')
  return testimonials
}

const getReview = async (id: string): Promise<IReview | null> => {
  const singleReview = await Review.findById(id)
    .populate('user')
    .populate('service')

  if (!singleReview) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found')
  }

  return singleReview
}

const deleteReview = async (id: string): Promise<null> => {
  const session = await startSession()

  try {
    session.startTransaction()

    // Deleting review
    const deletedReview = await Review.findByIdAndDelete(id, { session })

    if (!deletedReview) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found')
    }

    // Removing review from the specific service reviews array
    await Service.updateOne(
      { _id: deletedReview.service },
      { $pull: { reviews: id } },
      {
        new: true,
        runValidators: true,
        session,
      }
    )

    await session.commitTransaction()

    return null
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export const ReviewService = {
  createReview,
  getAllReviews,
  getTestimonials,
  getReview,
  deleteReview,
}

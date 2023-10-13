import httpStatus from 'http-status'
import { JwtPayload } from 'jsonwebtoken'
import { startSession } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { Service } from '../service/service.model'
import { IReview } from './review.interface'
import { Review } from './review.model'

const createReview = async (
  body: IReview,
  user: JwtPayload
): Promise<IReview | null> => {
  const session = await startSession()

  try {
    session.startTransaction()

    // Creating review
    const createdReview = await Review.create(
      [{ ...body, user: user.userId }],
      {
        session,
      }
    )

    // Adding review to the specific service reviews array
    await Service.updateOne(
      { _id: body.service },
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
  const isAdmin = user.role === 'admin' || user.role === 'super_dmin'

  const findQuery = isAdmin ? {} : { user: user.userId }

  const allReviews = await Review.find(findQuery)
    .populate('user')
    .populate('service')
  return allReviews
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
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }

  return null
}

export const ReviewService = {
  createReview,
  getAllReviews,
  getReview,
  deleteReview,
}

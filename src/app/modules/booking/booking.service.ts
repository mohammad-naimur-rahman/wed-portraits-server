import httpStatus from 'http-status'
import { JwtPayload } from 'jsonwebtoken'
import { startSession } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { User } from '../user/user.model'
import { IBooking } from './booking.interface'
import { Booking } from './booking.model'

const createBooking = async (
  payload: IBooking,
  user: JwtPayload
): Promise<IBooking | null> => {
  const session = await startSession()

  try {
    session.startTransaction()

    // Creating Booking
    const createdBooking = await Booking.create(
      [{ ...payload, user: user.userId }],
      {
        session,
      }
    )

    // Adding Booking to the specific service Bookings array
    await User.updateOne(
      { _id: user.userId },
      {
        $push: { bookings: createdBooking[0]._id },
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    )

    await session.commitTransaction()

    return createdBooking[0]
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const getAllBookings = async (user: JwtPayload): Promise<IBooking[]> => {
  const isAdmin = user.role === 'admin' || user.role === 'super_dmin'

  const findQuery = isAdmin ? {} : { user: user.userId }

  const allBookings = await Booking.find(findQuery)
    .populate('user')
    .populate('service')
  return allBookings
}

const getBooking = async (id: string): Promise<IBooking | null> => {
  const singleBooking = await Booking.findById(id)
    .populate('user')
    .populate('service')

  if (!singleBooking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found')
  }

  return singleBooking
}

// TODO: can't go backword, user only can cancel booking
const updateBooking = async (
  id: string,
  payload: IBooking
): Promise<IBooking | null> => {
  const updatedBooking = await Booking.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedBooking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found')
  }

  return updatedBooking
}

const deleteBooking = async (id: string): Promise<null> => {
  const session = await startSession()

  try {
    session.startTransaction()

    // Deleting Booking
    const deletedBooking = await Booking.findByIdAndDelete(id, { session })

    if (!deletedBooking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found')
    }

    // Removing Booking from the specific service Bookings array
    await User.updateOne(
      { _id: deletedBooking.user },
      { $pull: { bookings: id } },
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

export const BookingService = {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
}

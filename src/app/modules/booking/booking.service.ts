import httpStatus from 'http-status'
import { JwtPayload } from 'jsonwebtoken'
import { startSession } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { Service } from '../service/service.model'
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
  const isAdmin = user.role === 'admin' || user.role === 'super_admin'

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

const getBookingDates = async (serviceId: string): Promise<Date[]> => {
  const service = await Service.findById(serviceId)

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found')
  }

  const bookings = await Booking.find({
    service: serviceId,
    status: { $in: ['pending', 'confirmed', 'ongoing'] },
  })

  const bookingDates = bookings.map(booking => booking.date)
  return bookingDates
}

const updateBooking = async (
  id: string,
  payload: IBooking,
  user: JwtPayload
): Promise<IBooking | null> => {
  const currentBooking = await Booking.findById(id)

  if (!currentBooking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found')
  }

  const currentStatus = currentBooking.status

  const { status } = payload

  if (currentStatus !== 'pending' && status === 'cancelled') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Booking cannot be cancelled after confirmation!'
    )
  }

  if (status !== 'cancelled' && user.role === 'user') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User can not update booking other than cancelling!'
    )
  }

  if (currentStatus !== 'pending' && status == 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Booking cannot be backwarded!')
  }

  const updatedBooking = await Booking.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

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

    await session.commitTransaction()
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
  getBookingDates,
  updateBooking,
  deleteBooking,
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express'
import httpStatus from 'http-status'
import { JwtPayload } from 'jsonwebtoken'
import { startSession } from 'mongoose'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { stripe } from '../../../lib/stripe'
import { Payment } from '../payment/payment.model'
import { Service } from '../service/service.model'
import { User } from '../user/user.model'
import { IBooking, IBookingQuery } from './booking.interface'
import { Booking } from './booking.model'

const createBooking = async (req: Request): Promise<string | null> => {
  const user = req.user as JwtPayload
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(
      (req as any).rawBody,
      sig!,
      config.stripeConfigs.webhook_secret
    )
  } catch (err) {
    return (err as Error).message
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const checkoutSession = event.data.object

      const session = await startSession()

      try {
        session.startTransaction()

        if (!checkoutSession.metadata?.id) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Checkout Failed!')
        }

        const paymentId = checkoutSession.metadata.id

        const currentBooking = await Payment.findById(paymentId)

        console.log({ currentBooking })

        if (!currentBooking) {
          throw new ApiError(httpStatus.NOT_FOUND, 'No booking found!')
        }

        const itemsToSave: IBooking[] = currentBooking.services.map(service => {
          return {
            service: service.service,
            date: service.date,
            status: 'confirmed',
            user: user.userId,
          }
        })

        // Creating Booking
        const createdBooking = await Booking.insertMany(itemsToSave, {
          session,
        })

        console.log('BOOKING CREATED')

        await Payment.findByIdAndUpdate(
          paymentId,
          { status: 'fulfilled' },
          { session, runValidators: true }
        )

        console.log('PAYMENT UPDATED')

        // Adding Booking to the specific service Bookings array
        await User.updateOne(
          { _id: user.userId },
          {
            $push: { bookings: createdBooking.map(booking => booking._id) },
          },
          {
            runValidators: true,
            session,
          }
        )

        console.log('USER UPDATED')

        await session.commitTransaction()

        return 'Payment Successful!'
      } catch (error) {
        await session.abortTransaction()
        throw error
      } finally {
        session.endSession()
      }
    }
    default:
      return 'Payment Failed!'
  }
}

const getAllBookings = async (
  query: any,
  user: JwtPayload
): Promise<IBooking[]> => {
  const findQuery: IBookingQuery = {}

  const isAdmin = user.role === 'admin' || user.role === 'super_admin'

  if (!isAdmin) {
    findQuery.user = user.userId
  }

  if (query.status && query.status !== 'all') {
    findQuery.status = query.status
  }

  const allBookings = Booking.find(findQuery)
    .populate('user')
    .populate('service')
  return allBookings
}

const getBooking = async (id: string): Promise<IBooking | null> => {
  const singleBooking = await Booking.findById(id)
    .populate('user')
    .populate('service')

  if (!singleBooking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found!')
  }

  return singleBooking
}

const getBookingDates = async (serviceId: string): Promise<Date[]> => {
  const service = await Service.findById(serviceId)

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found!')
  }

  const bookings = await Booking.find({
    service: serviceId,
    status: { $in: ['pending', 'confirmed', 'ongoing'] },
  })

  const bookingDates = bookings.map(booking => booking.date)
  return bookingDates
}

const hasTakenService = async (
  serviceId: string,
  userId: string
): Promise<IBooking[]> => {
  const service = await Service.findById(serviceId)

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found!')
  }

  const hasTakenService = await Booking.find({
    service: serviceId,
    user: userId,
    status: 'fulfilled',
  }).select('id')

  return hasTakenService
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

  if (currentStatus === 'cancelled' && status !== 'cancelled') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Booking cannot be updated after cancellation!'
    )
  }

  if (
    (currentStatus !== 'pending' && status == 'pending') ||
    (currentStatus === 'fulfilled' && status == 'ongoing')
  ) {
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

    const targetedBooking = await Booking.findById(id)

    if (!targetedBooking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found')
    }

    if (targetedBooking.status !== 'ongoing') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Ongoing event's booking can't be deleted!`
      )
    }

    // Deleting Booking
    await Booking.findByIdAndDelete(id, { session })

    // Removing Booking from the specific service Bookings array
    await User.updateOne(
      { _id: targetedBooking.user },
      { $pull: { bookings: id } },
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

export const BookingService = {
  createBooking,
  getAllBookings,
  getBooking,
  getBookingDates,
  hasTakenService,
  updateBooking,
  deleteBooking,
}

import httpStatus from 'http-status'
import { RequestWithUser } from '../../../interfaces/common'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IBooking } from './booking.interface'
import { BookingService } from './booking.service'

const createBooking = catchAsync(async (req, res) => {
  const paymentMessage = await BookingService.createBooking(req)
  sendResponse<string>(res, {
    statusCode: httpStatus.CREATED,
    data: paymentMessage,
    message: 'Booking created successfully!',
  })
})

const getALllBookings = catchAsync(async (req, res) => {
  const allBookings = await BookingService.getAllBookings(
    req.query,
    (req as RequestWithUser).user
  )
  sendResponse<IBooking[]>(res, {
    statusCode: httpStatus.OK,
    data: allBookings,
    message: 'All Bookings retrieved successfully!',
  })
})

const getBooking = catchAsync(async (req, res) => {
  const singleBooking = await BookingService.getBooking(req.params.id)
  sendResponse<IBooking>(res, {
    statusCode: httpStatus.OK,
    data: singleBooking,
    message: 'Booking retrieved successfully!',
  })
})

const getBookingDates = catchAsync(async (req, res) => {
  const bookingDates = await BookingService.getBookingDates(
    req.params.serviceId
  )
  sendResponse<Date[]>(res, {
    statusCode: httpStatus.OK,
    data: bookingDates,
    message: 'Booking dates retrieved successfully!',
  })
})

const hasTakenService = catchAsync(async (req, res) => {
  const hasTaken = await BookingService.hasTakenService(
    req.params.serviceId,
    req.params.userId
  )
  sendResponse<IBooking[]>(res, {
    statusCode: httpStatus.OK,
    data: hasTaken,
    message: 'Service Taking Status retrieved successfully!',
  })
})

const updateBooking = catchAsync(async (req, res) => {
  const {
    params: { id },
    body,
  } = req
  const updatedBooking = await BookingService.updateBooking(
    id,
    body,
    (req as RequestWithUser).user
  )
  sendResponse<IBooking>(res, {
    statusCode: httpStatus.OK,
    data: updatedBooking,
    message: 'Booking updated successfully!',
  })
})

const deleteBooking = catchAsync(async (req, res) => {
  const deltedBooking = await BookingService.deleteBooking(req.params.id)
  sendResponse<IBooking>(res, {
    statusCode: httpStatus.NO_CONTENT,
    data: deltedBooking,
    message: 'Booking deleted successfully!',
  })
})

export const BookingController = {
  createBooking,
  getALllBookings,
  getBooking,
  getBookingDates,
  hasTakenService,
  updateBooking,
  deleteBooking,
}

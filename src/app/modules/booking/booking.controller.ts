import httpStatus from 'http-status'
import { RequestWithUser } from '../../../interfaces/common'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IBooking } from './booking.interface'
import { BookingService } from './booking.service'

const createBooking = catchAsync(async (req, res) => {
  const createdBooking = await BookingService.createBooking(
    req.body,
    (req as RequestWithUser).user
  )
  sendResponse<IBooking>(res, {
    statusCode: httpStatus.CREATED,
    data: createdBooking,
    message: 'Booking created successfully!',
  })
})

const getALllBookings = catchAsync(async (req, res) => {
  const allBookings = await BookingService.getAllBookings(
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

const updateBooking = catchAsync(async (req, res) => {
  const {
    params: { id },
    body,
  } = req
  const updatedBooking = await BookingService.updateBooking(id, body)
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
  updateBooking,
  deleteBooking,
}

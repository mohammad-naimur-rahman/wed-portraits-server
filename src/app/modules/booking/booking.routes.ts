import express, { Router } from 'express'
import { ENUM_USER_ROLE } from '../../../enums/user'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { BookingController } from './booking.controller'
import { BookingValidation } from './booking.validation'

const router = Router()

router
  .route('/')
  .get(
    authGuard(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.USER
    ),
    BookingController.getALllBookings
  )
  .post(
    express.raw({ type: 'application/json' }),
    BookingController.createBooking
  )

router.get('/dates/:serviceId', BookingController.getBookingDates)

router.get('/has-taken/:serviceId/:userId', BookingController.hasTakenService)

router
  .route('/:id')
  .get(
    authGuard(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.USER
    ),
    BookingController.getBooking
  )
  .patch(
    authGuard(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.USER
    ),
    validateRequest(BookingValidation.updateBookingZSchema),
    BookingController.updateBooking
  )
  .delete(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    BookingController.deleteBooking
  )

export const BookingRoutes = router

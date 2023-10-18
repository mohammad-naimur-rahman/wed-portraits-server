import { Router } from 'express'
import { ENUM_USER_ROLE } from '../../../enums/user'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { ReviewController } from './review.controller'
import { ReviewValidation } from './review.validation'

const router = Router()

router
  .route('/')
  .get(
    authGuard(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.USER
    ),
    ReviewController.getALllReviews
  )
  .post(
    authGuard(ENUM_USER_ROLE.USER),
    validateRequest(ReviewValidation.createReviewZSchema),
    ReviewController.createReview
  )

router.get('/testimonials', ReviewController.getTestimonials)

router
  .route('/:id')
  .get(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    ReviewController.getReview
  )
  .delete(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    ReviewController.deleteReview
  )

export const ReviewRoutes = router

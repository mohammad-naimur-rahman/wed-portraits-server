import { Router } from 'express'
import { ENUM_USER_ROLE } from '../../../enums/user'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { FeedbackController } from './feedback.controller'
import { FeedbackValidation } from './feedback.validation'

const router = Router()

router
  .route('/')
  .get(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    FeedbackController.getALllFeedbacks
  )
  .post(
    authGuard(ENUM_USER_ROLE.USER),
    validateRequest(FeedbackValidation.createFeedbackZSchema),
    FeedbackController.createFeedback
  )

router
  .route('/:id')
  .get(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    FeedbackController.getFeedback
  )
  .delete(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    FeedbackController.deleteFeedback
  )

export const FeedbackRoutes = router

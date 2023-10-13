import { Router } from 'express'
import { ENUM_USER_ROLE } from '../../../enums/user'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { FaqController } from './faq.controller'
import { FaqValidation } from './faq.validation'

const router = Router()

router
  .route('/')
  .get(FaqController.getALllFaqs)
  .post(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(FaqValidation.createFaqZSchema),
    FaqController.createFaq
  )

router
  .route('/:id')
  .get(FaqController.getFaq)
  .patch(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(FaqValidation.updateFaqZSchema),
    FaqController.updateFaq
  )
  .delete(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    FaqController.deleteFaq
  )

export const FaqRoutes = router

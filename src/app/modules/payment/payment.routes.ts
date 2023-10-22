import { Router } from 'express'
import { ENUM_USER_ROLE } from '../../../enums/user'
import authGuard from '../../middlewares/authGuard'
import { PaymentController } from './payment.controller'

const router = Router()

router.post(
  '/',
  authGuard(ENUM_USER_ROLE.USER),
  PaymentController.proceedToPayment
)

export const PaymentRoutes = router

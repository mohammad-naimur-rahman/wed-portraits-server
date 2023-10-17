import { Router } from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthController } from './auth.contoller'
import { AuthValidation } from './auth.validation'

const router = Router()

router.post(
  '/login',
  validateRequest(AuthValidation.loginUserZSchema),
  AuthController.loginUser
)

router.post(
  '/signup',
  validateRequest(AuthValidation.signupUserZSchema),
  AuthController.signupUser
)

router.get(
  '/access-token',
  // validateRequest(AuthValidation.accessTokenZSchema),
  AuthController.accessToken
)

export const AuthRoutes = router

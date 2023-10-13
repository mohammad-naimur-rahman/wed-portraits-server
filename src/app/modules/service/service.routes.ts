import { Router } from 'express'
import { ENUM_USER_ROLE } from '../../../enums/user'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { ServiceController } from './service.controller'
import { ServiceValidation } from './service.validation'

const router = Router()

router
  .route('/')
  .get(ServiceController.getALllServices)
  .post(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(ServiceValidation.createServiceZSchema),
    ServiceController.createService
  )

router
  .route('/:id')
  .get(ServiceController.getService)
  .patch(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    ServiceController.updateService
  )
  .delete(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    ServiceController.deleteService
  )

export const ServiceRoutes = router

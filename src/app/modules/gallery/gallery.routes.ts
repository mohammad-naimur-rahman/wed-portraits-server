import { Router } from 'express'
import { ENUM_USER_ROLE } from '../../../enums/user'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { GalleryController } from './gallery.controller'
import { GalleryValidation } from './gallery.validation'

const router = Router()

router
  .route('/')
  .get(GalleryController.getALllGalleries)
  .post(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(GalleryValidation.createGallaryZSchema),
    GalleryController.createGallery
  )

router
  .route('/:id')
  .get(GalleryController.getGallery)
  .patch(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(GalleryValidation.updateGallaryZSchema),
    GalleryController.updateGallery
  )
  .delete(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    GalleryController.deleteGallery
  )

export const GalleryRoutes = router

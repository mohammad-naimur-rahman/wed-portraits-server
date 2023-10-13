import { Router } from 'express'
import { ENUM_USER_ROLE } from '../../../enums/user'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { BlogController } from './blog.controller'
import { BlogValidation } from './blog.validation'

const router = Router()

router
  .route('/')
  .get(BlogController.getALllBlogs)
  .post(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(BlogValidation.createBlogZSchema),
    BlogController.createBlog
  )

router
  .route('/:id')
  .get(BlogController.getBlog)
  .patch(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(BlogValidation.updateBlogZSchema),
    BlogController.createBlog
  )
  .delete(
    authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    BlogController.deleteBlog
  )

export const BlogRoutes = router

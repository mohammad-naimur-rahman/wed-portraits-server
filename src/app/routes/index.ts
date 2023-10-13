import express from 'express'
import { AuthRoutes } from '../modules/auth/auth.routes'
import { FaqRoutes } from '../modules/faq/faq.routes'
import { ReviewRoutes } from '../modules/review/review.routes'
import { ServiceRoutes } from '../modules/service/service.routes'
import { UserRoutes } from '../modules/user/user.routes'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/users',
    routes: UserRoutes,
  },
  {
    path: '/services',
    routes: ServiceRoutes,
  },
  {
    path: '/reviews',
    routes: ReviewRoutes,
  },
  {
    path: '/faqs',
    routes: FaqRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.routes))
export default router

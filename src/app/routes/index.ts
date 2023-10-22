import express from 'express'
import { AuthRoutes } from '../modules/auth/auth.routes'
import { BlogRoutes } from '../modules/blog/blog.routes'
import { BookingRoutes } from '../modules/booking/booking.routes'
import { FaqRoutes } from '../modules/faq/faq.routes'
import { FeedbackRoutes } from '../modules/feedback/feedback.routes'
import { GalleryRoutes } from '../modules/gallery/gallery.routes'
import { PaymentRoutes } from '../modules/payment/payment.routes'
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
    path: '/bookings',
    routes: BookingRoutes,
  },
  {
    path: '/blogs',
    routes: BlogRoutes,
  },
  {
    path: '/feedbacks',
    routes: FeedbackRoutes,
  },
  {
    path: '/faqs',
    routes: FaqRoutes,
  },
  {
    path: '/galleries',
    routes: GalleryRoutes,
  },
  {
    path: '/payment',
    routes: PaymentRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.routes))
export default router

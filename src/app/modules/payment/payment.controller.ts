import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { PaymentService } from './payment.service'

const proceedToPayment = catchAsync(async (req, res) => {
  const sessionId = await PaymentService.proceedToPayment(req.body)
  sendResponse<string>(res, {
    statusCode: httpStatus.CREATED,
    data: sessionId,
    message: 'Booking listed for payment!',
  })
})

export const PaymentController = {
  proceedToPayment,
}

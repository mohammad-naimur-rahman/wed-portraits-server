import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IFaq } from './faq.interface'
import { FaqService } from './faq.service'

const createFaq = catchAsync(async (req, res) => {
  const createdFaq = await FaqService.createFaq(req.body)
  sendResponse<IFaq>(res, {
    statusCode: httpStatus.CREATED,
    data: createdFaq,
    message: 'Faq created successfully!',
  })
})

const getALllFaqs = catchAsync(async (req, res) => {
  const allFaqs = await FaqService.getAllFaqs()
  sendResponse<IFaq[]>(res, {
    statusCode: httpStatus.OK,
    data: allFaqs,
    message: 'All Faqs retrieved successfully!',
  })
})

const getFaq = catchAsync(async (req, res) => {
  const singleFaq = await FaqService.getFaq(req.params.id)
  sendResponse<IFaq>(res, {
    statusCode: httpStatus.OK,
    data: singleFaq,
    message: 'Faq retrieved successfully!',
  })
})

const updateFaq = catchAsync(async (req, res) => {
  const {
    params: { id },
    body,
  } = req
  const updatedFaq = await FaqService.updateFaq(id, body)
  sendResponse<IFaq>(res, {
    statusCode: httpStatus.OK,
    data: updatedFaq,
    message: 'Faq updated successfully!',
  })
})

const deleteFaq = catchAsync(async (req, res) => {
  const deltedFaq = await FaqService.deleteFaq(req.params.id)
  sendResponse<IFaq>(res, {
    statusCode: httpStatus.NO_CONTENT,
    data: deltedFaq,
    message: 'Faq deleted successfully!',
  })
})

export const FaqController = {
  createFaq,
  getALllFaqs,
  getFaq,
  updateFaq,
  deleteFaq,
}

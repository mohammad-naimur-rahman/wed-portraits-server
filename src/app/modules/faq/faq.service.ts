import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IFaq } from './faq.interface'
import { Faq } from './faq.model'

const createFaq = async (payload: IFaq): Promise<IFaq | null> => {
  const createdFaq = await Faq.create(payload)
  return createdFaq
}

const getAllFaqs = async (): Promise<IFaq[]> => {
  const allFaqs = await Faq.find()
  return allFaqs
}

const updateFaq = async (
  id: string,
  payload: Partial<IFaq>
): Promise<IFaq | null> => {
  const updatedFaq = await Faq.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedFaq) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faq not found')
  }

  return updatedFaq
}

const deleteFaq = async (id: string): Promise<null> => {
  const deletedFaq = await Faq.findByIdAndDelete(id)

  if (!deletedFaq) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faq not found')
  }

  return null
}

export const FaqService = {
  createFaq,
  getAllFaqs,
  updateFaq,
  deleteFaq,
}

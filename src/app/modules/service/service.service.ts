import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IService } from './service.interface'
import { Service } from './service.model'

const createService = async (payload: IService): Promise<IService | null> => {
  const createdService = await Service.create(payload)
  return createdService
}

const getAllServices = async (): Promise<IService[]> => {
  const allServices = await Service.find()
  return allServices
}

const getService = async (id: string): Promise<IService | null> => {
  const singleService = await Service.findById(id).populate({
    path: 'reviews',
    options: {
      populate: ['user'],
    },
  })

  if (!singleService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found')
  }

  return singleService
}

const updateService = async (
  id: string,
  payload: IService
): Promise<IService | null> => {
  const updatedService = await Service.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found')
  }

  return updatedService
}

const deleteService = async (id: string): Promise<null> => {
  const deletedService = await Service.findByIdAndDelete(id)

  if (!deletedService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found')
  }

  return null
}

export const ServiceService = {
  createService,
  getAllServices,
  updateService,
  getService,
  deleteService,
}

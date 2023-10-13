import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IGenericResponse } from '../../../interfaces/common'
import { IService } from './service.interface'
import { Service } from './service.model'

const createService = async (payload: IService): Promise<IService | null> => {
  const createdService = await Service.create(payload)
  return createdService
}

const getAllServices = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any
): Promise<IGenericResponse<IService[]>> => {
  console.log(query)
  let baseQuery = Service.find()

  // Search by title
  if (query.title) {
    baseQuery = baseQuery.where('title').regex(new RegExp(query.title, 'i'))
  }

  // Filter by price range
  if (query.minPrice) {
    baseQuery = baseQuery.where('price').gte(query.minPrice)
  }
  if (query.maxPrice) {
    baseQuery = baseQuery.where('price').lte(query.maxPrice)
  }

  // Filter by category
  if (query.category) {
    baseQuery = baseQuery.where('category').equals(query.category)
  }

  // Sort by a field (default: 'price')
  const sortByField = query.sortBy || 'price'
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1
  baseQuery = baseQuery.sort({ [sortByField]: sortOrder })

  // Pagination
  const page = parseInt(query.page, 10) || 1
  const limit = parseInt(query.limit, 10) || 10
  const skip = (page - 1) * limit
  baseQuery = baseQuery.skip(skip).limit(limit)

  const total = await baseQuery.countDocuments()
  const allServices = await baseQuery.exec()

  // const allServices = await Service.find()
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: allServices,
  }
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IGenericResponse } from '../../../interfaces/common'
import { IService } from './service.interface'
import { Service } from './service.model'
import { buildQuery } from './service.utils'

const createService = async (payload: IService): Promise<IService | null> => {
  const createdService = await Service.create(payload)
  return createdService
}

const getAllServices = async (
  query: any
): Promise<IGenericResponse<IService[]>> => {
  const conditions = buildQuery(query)

  // Pagination
  const page = parseInt(query.page, 10) || 1
  const limit = parseInt(query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Sort by a field
  const sortByField = query.sortBy || 'createdAt'
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1

  const allServices = await Service.find(conditions)
    .sort({ [sortByField]: sortOrder })
    .skip(skip)
    .limit(limit)
    .exec()

  // Counting total
  const total = await Service.countDocuments(conditions)

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
      sort: { createdAt: -1 },
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

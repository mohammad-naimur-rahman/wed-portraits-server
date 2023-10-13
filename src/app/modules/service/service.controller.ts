import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IService } from './service.interface'
import { ServiceService } from './service.service'

const createService = catchAsync(async (req, res) => {
  const createdService = await ServiceService.createService(req.body)
  sendResponse<IService>(res, {
    statusCode: httpStatus.CREATED,
    data: createdService,
    message: 'Service created successfully!',
  })
})

const getALllServices = catchAsync(async (req, res) => {
  const allServices = await ServiceService.getAllServices(req.query)
  sendResponse<IService[]>(res, {
    statusCode: httpStatus.OK,
    meta: allServices.meta,
    data: allServices.data,
    message: 'All Services retrieved successfully!',
  })
})

const getService = catchAsync(async (req, res) => {
  const singleService = await ServiceService.getService(req.params.id)
  sendResponse<IService>(res, {
    statusCode: httpStatus.OK,
    data: singleService,
    message: 'Service retrieved successfully!',
  })
})

const updateService = catchAsync(async (req, res) => {
  const {
    body,
    params: { id },
  } = req
  const updatedService = await ServiceService.updateService(id, body)
  sendResponse<IService>(res, {
    statusCode: httpStatus.OK,
    data: updatedService,
    message: 'Service updated successfully!',
  })
})

const deleteService = catchAsync(async (req, res) => {
  const deltedService = await ServiceService.deleteService(req.params.id)
  sendResponse<IService>(res, {
    statusCode: httpStatus.NO_CONTENT,
    data: deltedService,
    message: 'Service deleted successfully!',
  })
})

export const ServiceController = {
  createService,
  getALllServices,
  getService,
  updateService,
  deleteService,
}

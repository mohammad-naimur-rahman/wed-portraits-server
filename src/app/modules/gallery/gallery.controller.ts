import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IGallery } from './gallery.interface'
import { GalleryService } from './gallery.service'
const createGallery = catchAsync(async (req, res) => {
  const createdGallery = await GalleryService.createGallery(req.body)
  sendResponse<IGallery>(res, {
    statusCode: httpStatus.CREATED,
    data: createdGallery,
    message: 'Gallery created successfully!',
  })
})

const getALllGalleries = catchAsync(async (req, res) => {
  const allGalleries = await GalleryService.getAllGalleries()
  sendResponse<IGallery[]>(res, {
    statusCode: httpStatus.OK,
    data: allGalleries,
    message: 'All Galleries retrieved successfully!',
  })
})

const getGallery = catchAsync(async (req, res) => {
  const singleGallery = await GalleryService.getGallery(req.params.id)
  sendResponse<IGallery>(res, {
    statusCode: httpStatus.OK,
    data: singleGallery,
    message: 'Gallery retrieved successfully!',
  })
})

const updateGallery = catchAsync(async (req, res) => {
  const {
    params: { id },
    body,
  } = req
  const updatedGallery = await GalleryService.updateGallery(id, body)
  sendResponse<IGallery>(res, {
    statusCode: httpStatus.OK,
    data: updatedGallery,
    message: 'Gallery updated successfully!',
  })
})

const deleteGallery = catchAsync(async (req, res) => {
  const deltedGallery = await GalleryService.deleteGallery(req.params.id)
  sendResponse<IGallery>(res, {
    statusCode: httpStatus.NO_CONTENT,
    data: deltedGallery,
    message: 'Gallery deleted successfully!',
  })
})

export const GalleryController = {
  createGallery,
  getALllGalleries,
  getGallery,
  updateGallery,
  deleteGallery,
}

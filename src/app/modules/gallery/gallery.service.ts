import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IGallery } from './gallery.interface'
import { Gallery } from './gallery.model'
const createGallery = async (payload: IGallery): Promise<IGallery | null> => {
  const createdGallery = await Gallery.create(payload)
  return createdGallery
}

const getAllGalleries = async (): Promise<IGallery[]> => {
  const allGalleries = await Gallery.find()
  return allGalleries
}

const getGallery = async (id: string): Promise<IGallery | null> => {
  const singleGallery = await Gallery.findById(id)

  if (!singleGallery) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gallery not found')
  }

  return singleGallery
}

const updateGallery = async (
  id: string,
  payload: Partial<IGallery>
): Promise<IGallery | null> => {
  const updatedGallery = await Gallery.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedGallery) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gallery not found')
  }

  return updatedGallery
}

const deleteGallery = async (id: string): Promise<null> => {
  const deletedGallery = await Gallery.findByIdAndDelete(id)

  if (!deletedGallery) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gallery not found')
  }

  return null
}

export const GalleryService = {
  createGallery,
  getAllGalleries,
  getGallery,
  updateGallery,
  deleteGallery,
}

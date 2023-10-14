import httpStatus from 'http-status'
import { RequestWithUser } from '../../../interfaces/common'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from './user.interface'
import { UserService } from './user.service'

const getALllUsers = catchAsync(async (req, res) => {
  const allUsers = await UserService.getAllUsers()
  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    data: allUsers,
    message: 'All users retrieved successfully!',
  })
})

const getUser = catchAsync(async (req, res) => {
  const user = await UserService.getUser(req.params.id)
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    data: user,
    message: 'User retrieved successfully!',
  })
})

const getOwnProfile = catchAsync(async (req, res) => {
  const user = await UserService.getOwnProfile((req as RequestWithUser).user)
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    data: user,
    message: 'Profile retrieved successfully!',
  })
})

const updateUser = catchAsync(async (req, res) => {
  const {
    body,
    params: { id },
  } = req
  const updatedUser = await UserService.updateUser(id, body)
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    data: updatedUser,
    message: 'User updated successfully!',
  })
})

const deleteUser = catchAsync(async (req, res) => {
  const deltedUser = await UserService.deleteUser(req.params.id)
  sendResponse<IUser>(res, {
    statusCode: httpStatus.NO_CONTENT,
    data: deltedUser,
    message: 'User deleted successfully!',
  })
})

export const UserController = {
  getALllUsers,
  getUser,
  getOwnProfile,
  updateUser,
  deleteUser,
}

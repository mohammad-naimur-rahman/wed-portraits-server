import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IUser } from './user.interface'
import { User } from './user.model'

const getAllUsers = async (): Promise<IUser[]> => {
  const allUsers = await User.find()
  return allUsers
}

const getUser = async (id: string): Promise<IUser | null> => {
  const singleUser = await User.findById(id)

  if (!singleUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  return singleUser
}

const updateUser = async (
  id: string,
  payload: IUser
): Promise<IUser | null> => {
  const updatedUser = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  return updatedUser
}

const deleteUser = async (id: string): Promise<null> => {
  const user = await User.findByIdAndDelete(id)

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  return null
}

export const UserService = {
  getAllUsers,
  updateUser,
  getUser,
  deleteUser,
}

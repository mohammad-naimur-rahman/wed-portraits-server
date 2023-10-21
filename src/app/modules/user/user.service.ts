/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import { JwtPayload } from 'jsonwebtoken'
import ApiError from '../../../errors/ApiError'
import { IUser } from './user.interface'
import { User } from './user.model'

const getAllUsers = async (
  query: { admins?: string },
  user: JwtPayload
): Promise<IUser[]> => {
  const findCondition =
    query?.admins === 'true' && user.role === 'super_admin'
      ? { role: { $in: ['super_admin', 'admin'] } }
      : {}
  const allUsers = await User.find(findCondition)
  return allUsers
}

const getUser = async (email: string): Promise<IUser | null> => {
  const singleUser = await User.findOne({ email })

  if (!singleUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!')
  }

  return singleUser
}

const getOwnProfile = async (user: JwtPayload): Promise<IUser | null> => {
  const profile = await User.findById(user.userId)

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!')
  }

  return profile
}

const updateUser = async (
  id: string,
  payload: IUser,
  user: JwtPayload
): Promise<IUser | null> => {
  const targetedUser = await User.findById(id)

  if (!targetedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!')
  }

  if (user.role === 'user' && user.userId !== id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can't change other user's profile`
    )
  }

  if (
    user.role !== 'user' &&
    targetedUser.role !== 'user' &&
    user.userId !== targetedUser.id
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can't change other admin's profile`
    )
  }

  const updatedUser = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  return updatedUser
}

const changeRole = async (email: string, payload: any): Promise<null> => {
  const targetedUser = await User.findOne({ email })

  if (!targetedUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not registered with this email!'
    )
  }

  if (targetedUser.role === 'super_admin') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can't change other super admin's role!`
    )
  }

  await User.findOneAndUpdate(
    { email },
    { role: payload.role },
    {
      new: true,
      runValidators: true,
    }
  )
  return null
}

const deleteUser = async (id: string): Promise<null> => {
  const targetedUser = await User.findById(id)

  if (!targetedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!')
  }

  if (targetedUser.role === 'super_admin') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can't delete other super admins`
    )
  }

  await User.findByIdAndDelete(id)
  return null
}

export const UserService = {
  getAllUsers,
  getUser,
  updateUser,
  changeRole,
  getOwnProfile,
  deleteUser,
}

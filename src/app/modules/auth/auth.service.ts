import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../../../config'
import { ENUM_USER_ROLE } from '../../../enums/user'
import ApiError from '../../../errors/ApiError'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import { User } from '../user/user.model'
import {
  IAccessTokenResponse,
  IAuthUserResponse,
  ILoginUser,
  ISignupUser,
} from './auth.interface'

const loginUser = async (payload: ILoginUser): Promise<IAuthUserResponse> => {
  const { email, password } = payload
  const isExist = await User.findOne({ email }).select('-password')

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!')
  }

  if (isExist.password && !(await bcrypt.compare(password, isExist.password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect!')
  }

  const { id: userId, role } = isExist

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  )

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  )

  return {
    accessToken,
    refreshToken,
    data: isExist,
  }
}

const signupUser = async (payload: ISignupUser): Promise<IAuthUserResponse> => {
  const isExist = await User.findOne({ email: payload.email })

  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists')
  }

  const createdUser = await User.create({
    ...payload,
    role: ENUM_USER_ROLE.USER,
  })

  const accessToken = jwtHelpers.createToken(
    { userId: createdUser.id, role: 'user' },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  )

  const refreshToken = jwtHelpers.createToken(
    { userId: createdUser.id, role: 'user' },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  )

  return {
    accessToken,
    refreshToken,
    data: createdUser,
  }
}

const accessToken = async (token: string): Promise<IAccessTokenResponse> => {
  console.log(token)

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
  }

  const givenRefreshToken = token?.split(' ')[1]

  if (givenRefreshToken === 'undefined') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!')
  }

  let verifiedToken = null

  try {
    verifiedToken = jwtHelpers.verifyToken(
      givenRefreshToken,
      config.jwt.refresh_secret as Secret
    )
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token')
  }

  const { userId } = verifiedToken

  // check if user exists
  const isUserExist = await await User.findById(userId)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  //generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  )

  return {
    accessToken: newAccessToken,
  }
}

export const AuthService = {
  loginUser,
  signupUser,
  accessToken,
}

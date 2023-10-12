import httpStatus from 'http-status'
import config from '../../../config'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IAccessTokenResponse, IAuthUserResponse } from './auth.interface'
import { AuthService } from './auth.service'

const cookieOptions = {
  secure: config.env === 'production',
  httpOnly: true,
}

const signupUser = catchAsync(async (req, res) => {
  const createdUser = await AuthService.signupUser(req.body)

  const { refreshToken } = createdUser

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<IAuthUserResponse>(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Signin successfull!',
    data: createdUser,
  })
})

const loginUser = catchAsync(async (req, res) => {
  const authCredentials = await AuthService.loginUser(req.body)

  const { refreshToken } = authCredentials

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<IAuthUserResponse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Login successfull!',
    data: authCredentials,
  })
})

const accessToken = catchAsync(async (req, res) => {
  const {
    cookies: { refreshToken },
  } = req
  const newAccessToken = await AuthService.accessToken(req.cookies.refreshToken)

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<IAccessTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Generated new access token successfully!',
    data: newAccessToken,
  })
})

export const AuthController = {
  signupUser,
  loginUser,
  accessToken,
}

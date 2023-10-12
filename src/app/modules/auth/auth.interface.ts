import { IUser } from '../user/user.interface'

export interface ILoginUser {
  email: string
  password: string
}

export interface ISignupUser {
  name: string
  email: string
  password: string
  image?: string
}

export interface IAuthUserResponse {
  accessToken: string
  refreshToken: string
  data: IUser
}

export interface IAccessTokenResponse {
  accessToken: string
}

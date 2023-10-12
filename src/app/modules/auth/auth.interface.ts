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

export interface ILoginUserResponse {
  accessToken: string
  refreshToken?: string
}

export interface IAccessTokenResponse {
  accessToken: string
}

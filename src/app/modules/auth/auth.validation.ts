import { z } from 'zod'
import { signUpRegex } from '../../../constants/regex'

const loginUserZSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
})

const signupUserZSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().refine(val => signUpRegex.test(val)),
    image: z.string().optional(),
  }),
})

const accessTokenZSchema = z.object({
  headers: z.object({
    authorization: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
})

export const AuthValidation = {
  loginUserZSchema,
  signupUserZSchema,
  accessTokenZSchema,
}

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

export const AuthValidation = {
  loginUserZSchema,
  signupUserZSchema,
}

import dotenv from 'dotenv'
import path from 'path'
import { z } from 'zod'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const envVarSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z
    .string()
    .default('5000')
    .refine(val => Number(val)),
  DATABASE_URL: z.string(),
  BCRYPT_SALT_ROUNDS: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  FE_HOST: z.string(),
})

const envVars = envVarSchema.parse(process.env)

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  database_url: envVars.DATABASE_URL,
  bycrypt_salt_rounds: envVars.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: envVars.JWT_SECRET,
    refresh_secret: envVars.JWT_REFRESH_SECRET,
    expires_in: envVars.JWT_EXPIRES_IN,
    refresh_expires_in: envVars.JWT_REFRESH_EXPIRES_IN,
  },
  stripeConfigs: {
    secret_key: envVars.STRIPE_SECRET_KEY,
    webhook_secret: envVars.STRIPE_WEBHOOK_SECRET,
  },
  fe_host: envVars.FE_HOST,
}

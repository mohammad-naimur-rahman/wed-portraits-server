import bcrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import config from '../../../config'
import { emailRegex, signUpRegex } from '../../../constants/regex'
import { IUser, UserModel } from './user.interface'

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validarot: (val: string) => {
        return emailRegex.test(val)
      },
    },
    image: String,
    password: {
      type: String,
      required: true,
      validator: (val: string) => {
        return signUpRegex.test(val)
      },
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'user'],
      default: 'user',
    },
    reservations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reservation',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

UserSchema.pre('save', async function (next) {
  // hashing user password
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  )

  next()
})

export const User = model<IUser, UserModel>('User', UserSchema)

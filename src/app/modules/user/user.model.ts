import bcrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import config from '../../../config'
import { emailRegex, signUpRegex } from '../../../constants/regex'
import { ENUM_USER_ROLE } from '../../../enums/user'
import { IUser, UserModel } from './user.interface'

const UserSchema = new Schema<IUser, UserModel>(
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
      enum: Object.values(ENUM_USER_ROLE),
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

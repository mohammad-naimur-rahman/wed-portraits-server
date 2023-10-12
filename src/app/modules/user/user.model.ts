import { Schema, model } from 'mongoose'
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

export const User = model<IUser, UserModel>('User', UserSchema)

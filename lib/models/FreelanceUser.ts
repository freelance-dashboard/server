import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_PASSWORD_ROUNDS = 10

interface IFreelanceUser extends mongoose.Document {
  nid: string
  name: string
  nick: string
  password: string
  matchPassword: (password: string) => boolean
}

const freelanceUserSchema = new mongoose.Schema<IFreelanceUser>({
  nid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  nick: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

freelanceUserSchema.method('matchPassword', function (password) {
  return bcrypt.compareSync(password, this.password)
})

freelanceUserSchema.pre<IFreelanceUser>('save', function (next) {
  bcrypt.hash(this.password, SALT_PASSWORD_ROUNDS, (error, encrypted) => {
    if (error) return next(error)

    this.password = encrypted
    next()
  })
})

export const FreeelanceUserModel = mongoose.model<IFreelanceUser>('FreelanceUser', freelanceUserSchema)

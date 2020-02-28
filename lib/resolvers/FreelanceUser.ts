import jwt from 'jsonwebtoken'
import { FreeelanceUserModel } from '../models/FreelanceUser'


export const Query = {
  async loginFreelanceUser (_, { nick, password }) {
    const freelanceUser = await FreeelanceUserModel.findOne({ nick }).exec()

    if (!freelanceUser || !freelanceUser.matchPassword(password)) {
      throw new Error('Invalid credentials')
    }

    const result = freelanceUser.toObject({
      versionKey: false
    })

    delete result.password

    return jwt.sign(result, process.env.JWT_SECRET)
  }
}

export const Mutation = {
  async createFreelanceUser (_, { data }) {
    const freelanceUserModel = new FreeelanceUserModel(data)

    await freelanceUserModel.save()

    return freelanceUserModel.toObject()
  }
}

import path from 'path'
import { GraphQLServer } from 'graphql-yoga'
import mongoose from 'mongoose'
import createJWTMiddleware from 'express-jwt'

/**
 * Resolvers
 */
import * as FreelanceUserResolvers from './resolvers/FreelanceUser'

const __DEV__ = process.env.NODE_ENV !== 'production'

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, './schema/root.graphql'),
  resolvers: [
    FreelanceUserResolvers
  ],
  context: ctx => ctx
})

const jwtMiddleware = createJWTMiddleware({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false
})

server.use('/api', jwtMiddleware)

;(async () => {
  await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  await server.start({
    port: process.env.PORT ?? 4000,
    endpoint: '/api',
    subscriptions: '/api',
    playground: __DEV__ && '/playground'
  })

  console.log('Server started')
})()

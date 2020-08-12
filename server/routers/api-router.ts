import Router from 'koa-router'
import { jwtAccessTokenMiddleware } from '../middlewares/jwt-access-token-middleware'

export const apiRouter = new Router()

apiRouter.post('/api/:version/graphql', jwtAccessTokenMiddleware, async (context, next) => {
  const { user, domain, application } = context.state

  context.body = {
    result: 'API called'
  }
})

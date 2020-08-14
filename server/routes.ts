import { oauth2Router, apiRouter } from './routers'
import session from 'koa-session'
import { SECRET } from '@things-factory/auth-base'

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  var paths = ['admin']

  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  /* oauth2orize-koa 에서 oauth 트랜잭션 관리를 위해서 session을 사용함. */
  app.keys = [SECRET]
  app.use(session(app))

  app.use(oauth2Router.routes())
  app.use(apiRouter.routes())
})

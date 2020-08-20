import { oauth2Router } from './routers'
import session from 'koa-session'
import { SECRET } from '@things-factory/auth-base'

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  var paths = ['admin']

  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-domain-public-route' as any, (app, domainPublicRouter) => {
  /* oauth2orize-koa 에서 oauth 트랜잭션 관리를 위해서 session을 사용함. */
  app.keys = [SECRET]
  app.use(session(app))

  domainPublicRouter.use('/admin', oauth2Router.routes(), oauth2Router.allowedMethods())
})

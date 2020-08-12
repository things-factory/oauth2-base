import { oauth2Router, apiRouter } from './routers'
import session from 'koa-session'
import { SECRET } from '@things-factory/auth-base'

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  var paths = [
    // static pages
    'admin',
    'oauth-decision',
    'oauth'
  ]

  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  app.keys = [SECRET]
  app.use(session(app))

  app.use(oauth2Router.routes())
  app.use(apiRouter.routes())
})

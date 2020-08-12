import { oauth2Router, apiRouter } from './routers'
import session from 'koa-session'
import { config } from '@things-factory/env'

var SECRET = config.get('SECRET')
if (!SECRET) {
  if (process.env.NODE_ENV == 'production') {
    throw new TypeError('SECRET key not configured.')
  } else {
    SECRET = '0xD58F835B69D207A76CC5F84a70a1D0d4C79dAC95'
  }
}

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

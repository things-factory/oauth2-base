import { oauth2Router, vhostRouter } from './routers'
import session from 'koa-session'
import Subdomain from 'koa-subdomain'
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
  /*
   * fallback white list를 추가할 수 있다
   *
   * ex)
   * var paths = [
   *   'aaa',
   *   'bbb'
   * ]
   * fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
   */
  var paths = [
    // static pages
    'admin',
    'oauth-decision',
    'oauth',
    'xxx'
  ]

  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  app.keys = [SECRET]
  app.use(session(app))

  const subdomain = new Subdomain()

  subdomain.use('auth', oauth2Router.routes())
  subdomain.use('*', vhostRouter.routes())

  app.use(subdomain.routes())
})

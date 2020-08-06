import { oauth2Router } from './routers'
import session from 'koa-session'

import Subdomain from 'koa-subdomain'

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
    'oauth'
  ]

  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  /*
   * koa application에 routes 를 추가할 수 있다.
   *
   * ex) routes.get('/path', async(context, next) => {})
   * ex) routes.post('/path', async(context, next) => {})
   */
  app.keys = ['im a newer secret', 'i like turtle']
  app.use(session(app))

  const subdomain = new Subdomain()

  subdomain.use('*', oauth2Router.routes())

  app.use(subdomain.routes())
})

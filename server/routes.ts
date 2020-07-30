import { authorization, decision, token } from './oauth2'

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
    'oauth-dialog'
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

  routes.get('/oauth/authorize', ...authorization)
  routes.post('/oauth/decision', ...decision)
  routes.post('/oauth/token', ...token)

  // static pages
  routes.get('/oauth-dialog', async (context, next) => {
    await context.render('auth-page', {
      pageElement: 'oauth-dialog',
      elementScript: '/oauth-dialog.js',
      data: {}
    })
  })
})

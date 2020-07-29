import oauth2orize from 'oauth2orize-koa'
import { getRepository } from 'typeorm'
import { makeAuthToken, saveAuthToken } from './controllers/utils'
import { AuthToken, AuthTokenType } from './entities'

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
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  /*
   * koa application에 routes 를 추가할 수 있다.
   *
   * ex) routes.get('/path', async(context, next) => {})
   * ex) routes.post('/path', async(context, next) => {})
   */

  var server = oauth2orize.createServer()

  server.grant(
    oauth2orize.grant.code(async function (app, redirectUrl, user, ares) {
      var token = makeAuthToken()
      saveAuthToken(user.id, token, AuthTokenType.GRANT)

      /* TODO app, redirectUrl, scope 을 담을 수 있도록 verification-token 엔티티를 수정한다. */
      /* TODO AuthTokenType에 GRANT를 추가한다. */

      return token
    })
  )

  server.exchange(
    oauth2orize.exchange.code(async function (app, token, redirectUrl) {
      var authToken = await getRepository(AuthToken).findOne({
        token
      })

      if (app.appKey !== authToken.appKey) {
        return false
      }

      if (redirectUrl !== authToken.redirectUrl) {
        return false
      }

      var token4accesstoken = makeAuthToken() // 256 bytes token
      // var at = new AccessToken(token4accesstoken, code.userId, code.appKey, code.scope)
      saveAuthToken(app.appKey, token, AuthTokenType.ACTIVATION)

      return token4accesstoken
    })
  )
})

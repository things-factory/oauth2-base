import oauth2orize from 'oauth2orize-koa'
import { getRepository } from 'typeorm'
import { VerificationToken, VerificationTokenType } from '@things-factory/auth-base'
import { makeVerificationToken, saveVerificationToken } from './controllers/utils'

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
    oauth2orize.grant.code(async function (client, redirectURI, user, ares) {
      var token = makeVerificationToken()
      saveVerificationToken(user.id, token, VerificationTokenType.GRANT)

      /* TODO client, redirectURI, scope 을 담을 수 있도록 verification-token 엔티티를 수정한다. */
      /* TODO VerificationTokenType에 GRANT를 추가한다. */

      return token
    })
  )

  server.exchange(
    oauth2orize.exchange.code(async function (client, token, redirectURI) {
      var verificationToken = await getRepository(VerificationToken).findOne({
        token
      })

      /* TODO clientId, redirectURI 가 verification-token 엔티티에 추가되어야 한다.
      if (client.id !== verificationToken.clientId) {
        return false
      }
      if (redirectURI !== verificationToken.redirectUri) {
        return false
      }
      */

      var token4accesstoken = makeVerificationToken() // 256 bytes token
      // var at = new AccessToken(token4accesstoken, code.userId, code.clientId, code.scope)
      saveVerificationToken(user.id, token, VerificationToken.XXXX)

      return token4accesstoken
    })
  )
})

import oauth2orize from 'oauth2orize-koa'

import { getRepository } from 'typeorm'
import { Application, AuthToken, AuthTokenStatus } from '../entities'
import { Domain } from '@things-factory/shell'
import { User, UserStatus } from '@things-factory/auth-base'

const debug = require('debug')('things-factory:oauth2-server:oauth2')

// create OAuth 2.0 server
export const server = oauth2orize.createServer()

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(async function (client) {
  debug('serialze', client)
  return client.id
})

server.deserializeClient(async function (id) {
  const application = await getRepository(Application).findOne(id)
  debug('deserialize', id, application)
  return application
})

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes.  The callback takes the `client` requesting
// authorization, the `redirectURI` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(
  oauth2orize.grant.code(async (client, redirectUrl, user, ares, areq) => {
    var subdomain = ares.warehouse
    const domain = await getRepository(Domain).findOne({
      subdomain
    })

    const repository = getRepository(AuthToken)
    const authToken = await repository.findOne({
      domain,
      application: client
    })

    debug(authToken)

    if (authToken) {
      await repository.save({
        ...authToken,
        user,
        accessToken: '',
        refreshToken: '',
        scope: ares.scope
      })
    } else {
      /* 새로 application이 바인딩되는 경우에는 user가 없다. */
      await repository.save({
        domain,
        application: client,
        status: AuthTokenStatus.GRANT,
        scope: ares.scope
      })
    }

    return AuthToken.generateAuthCode(authToken.id)
  })
)

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectURI` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(
  oauth2orize.exchange.code(async (client, code, redirectUrl) => {
    const repository = getRepository(AuthToken)
    try {
      /* 유효기간등을 처리하기 위해서 jwt 로 code를 엔코딩함. */
      const decoded = AuthToken.verifyAuthCode(code)

      /*
       * TODO 유효하지 않은 경우 AuthToken 엔티티에 대한 처리를 해야함.
       * - 상태에 따라서, 삭제하거나, authcode를 제거하고 상태를 변경함.
       * - 삭제 경우 : 상태가 GRANT 인 경우
       * - 변경 경우 : 상태가 GRANT 가 아닌 경우 ?
       */

      var grantToken = await repository.findOne(
        {
          id: decoded.id
        },
        { relations: ['domain', 'application', 'user', 'creator'] }
      )

      if (!grantToken) {
        console.error('grant Token is not exist')
        // authcode not valid
        return false
      }

      if (client.appKey !== grantToken.application.appKey) {
        console.error('client appKey is not same as grantToken appkey', client, grantToken.application)
        return false
      }
      // TODO revival....
      // if (redirectUrl !== grantToken.redirectUrl) {
      //   return false
      // }
    } catch (e) {
      console.error(e)
      return false
    }

    var user = grantToken.user
    if (!user) {
      const { email, domain } = grantToken.creator

      /* application type 사용자를 새로 만든다. */
      try {
        user = await getRepository(User).save({
          email: `${grantToken.id}-${email}`,
          userType: 'application',
          domain,
          /* roles: [], TODO scope에 따라서 Roles가 설정되어야 함. */
          status: UserStatus.ACTIVATED
        })
      } catch (e) {
        console.error(e)
        return false
      }
    }

    var accessToken = grantToken.generateAccessToken()
    var refreshToken = grantToken.generateRefreshToken()

    await repository.save({
      ...grantToken,
      user,
      accessToken,
      refreshToken,
      status: AuthTokenStatus.ACTIVATED
    })

    return [
      accessToken,
      refreshToken,
      {
        /* params */
      }
    ]
  })
)

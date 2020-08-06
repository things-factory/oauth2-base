import crypto from 'crypto'
import oauth2orize from 'oauth2orize-koa'

import { getRepository } from 'typeorm'
import { Application, AuthToken, AuthTokenType } from './entities'

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
  return client.id
})

server.deserializeClient(async function (id) {
  const repository = getRepository(Application)

  return await repository.findOne(id)
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
  oauth2orize.grant.code(async (client, redirectUrl, user, ares) => {
    var token = crypto.randomBytes(16).toString('hex')

    const repository = getRepository(AuthToken)
    await repository.save({
      name: client.appKey + ':' + user.id,
      userId: user.id,
      appKey: client.appKey,
      token: token,
      type: AuthTokenType.GRANT,
      scope: ''
    })

    /* TODO client, redirectUrl, scope 을 담을 수 있도록 verification-token 엔티티를 수정한다. */
    /* TODO AuthTokenType에 GRANT를 추가한다. */

    return token
  })
)

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectURI` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(
  oauth2orize.exchange.code(async (client, token, redirectUrl) => {
    const repository = getRepository(AuthToken)

    var grantToken = await repository.findOne({
      token
    })

    if (client.appKey !== grantToken.appKey) {
      return false
    }
    // TODO revival....
    // if (redirectUrl !== grantToken.redirectUrl) {
    //   return false
    // }

    await repository.delete(grantToken.id)
    var activationToken = crypto.randomBytes(256).toString('hex')

    await repository.save({
      name: `${grantToken.userId}:${client.appKey}`,
      userId: grantToken.userId,
      appKey: client.appKey,
      token: activationToken,
      type: AuthTokenType.ACTIVATION,
      scope: ''
    })

    return activationToken
  })
)

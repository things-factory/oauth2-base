import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import oauth2orize from 'oauth2orize-koa'

import { getRepository } from 'typeorm'
import { Application, AuthToken, AuthTokenType } from './entities'
import { sleep } from '@things-factory/utils'
import { config } from '@things-factory/env'

var SECRET = config.get('SECRET')
if (!SECRET) {
  if (process.env.NODE_ENV == 'production') {
    throw new TypeError('SECRET key not configured.')
  } else {
    SECRET = '0xD58F835B69D207A76CC5F84a70a1D0d4C79dAC95'
  }
}

/* auth-code signing for jsonwebtoken */
function generateAuthCode(appKey, redirectUrl) {
  var credential = {
    appKey,
    redirectUrl
  }

  return jwt.sign(credential, SECRET, {
    expiresIn: '1m'
  })
}

/* auth-code signing for jsonwebtoken */
function verifyAuthCode(authcode) {
  return jwt.verify(authcode, SECRET)
}

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
  oauth2orize.grant.code(async (client, redirectUrl, user, ares, areq) => {
    var authcode = generateAuthCode(client.appKey, client.redirectUrl) //crypto.randomBytes(256).toString('hex')

    await sleep(1000)
    // TODO how to get domain ????

    console.log('\n\n\n\ngrant code', client, redirectUrl, user, ares, areq)

    const repository = getRepository(AuthToken)
    await repository.save({
      name: client.appKey + ':' + user.id,
      user: user,
      appKey: client.appKey,
      token: authcode,
      type: AuthTokenType.GRANT,
      scope: ares.scope
      // domain: user.currentDomain %%%%%%%%%% 도메인을 어떻게 찾느냐 - res로부터 받아야지. %%%%%%%%%%%
    })

    /* TODO client, redirectUrl, scope 을 담을 수 있도록 verification-token 엔티티를 수정한다. */
    /* TODO AuthTokenType에 GRANT를 추가한다. */

    return authcode
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

    var grantToken = await repository.findOne(
      {
        token: code
      },
      { relations: ['user'] }
    )

    if (!grantToken) {
      // authcode not valid
      return false
    }

    try {
      /* 유효기간등을 처리하기 위해서 jwt 로 code를 엔코딩함. */
      const decoded = verifyAuthCode(code)
    } catch (e) {
      console.log(e)
      return false
    }

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
      name: `${grantToken.user?.email}:${client.appKey}`,
      user: grantToken.user,
      appKey: client.appKey,
      token: activationToken,
      type: AuthTokenType.ACTIVATION,
      scope: ''
    })

    return activationToken
  })
)

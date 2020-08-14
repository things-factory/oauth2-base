import oauth2orize from 'oauth2orize-koa'

import { getRepository } from 'typeorm'
import { Application } from '../entities'
import { Domain } from '@things-factory/shell'
import { User, UserStatus } from '@things-factory/auth-base'

const debug = require('debug')('things-factory:oauth2-server:oauth2')

export const NOTFOUND = 'NOTFOUND'
export const NonClient = {
  id: NOTFOUND
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
  debug('serialze', client)
  return client.id
})

server.deserializeClient(async function (id) {
  if (id == NOTFOUND) {
    debug('deserialize - not found')
    return {}
  }

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
    const { email, appKey, subdomain, scope, state } = ares

    return Application.generateAuthCode(email, appKey, subdomain, scope, state)
  })
)

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectURI` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(
  oauth2orize.exchange.code(async (client, code, redirectUrl) => {
    try {
      /* 유효기간등을 처리하기 위해서 jwt 로 code를 엔코딩함. */
      var decoded = Application.verifyAuthCode(code)
      debug('exchange - decoded', decoded)
    } catch (e) {
      console.error(e)
      return false
    }
    const { email, appKey, subdomain, scope, state } = decoded

    const application: Application = await getRepository(Application).findOne({
      appKey
    })

    if (!application) {
      console.error('application is not exist')
      return false
    }

    debug('exchange - application', application)

    if (redirectUrl !== application.redirectUrl) {
      console.error(
        'oauth2 exchange error - redirectUrl should be same as the application setting',
        redirectUrl,
        application.redirectUrl
      )
      // return false
      throw new TypeError(
        `oauth2 exchange error - redirectUrl should be same as the application setting : '${redirectUrl}':'${application.redirectUrl}'`
      )
    }

    const domain: Domain = await getRepository(Domain).findOne({
      subdomain
    })

    debug('exchange - domain', domain)

    const creator: User = await getRepository(User).findOne({
      email
    })

    debug('exchange - creator', creator)

    const appuserEmail = `${appKey}@${subdomain}`

    var appuser: User = await getRepository(User).findOne(
      {
        domain,
        email: appuserEmail,
        /* reference: application.id, TODO application, appliance 등의 레퍼런스가 꼭 필요하다. */
        userType: 'application'
      },
      {
        relations: ['domain', 'creator', 'updater']
      }
    )

    debug('exchange - appuser', appuser)

    if (!appuser) {
      /* newly create appuser */
      await getRepository(User).save({
        email: appuserEmail,
        name: application.name,
        userType: 'application',
        /* roles: [], TODO scope에 따라서 Roles가 설정되어야 함. */
        status: UserStatus.ACTIVATED,
        updater: creator,
        creator
      })

      appuser = await getRepository(User).findOne({
        where: { email: appuserEmail },
        relations: ['domain', 'domains']
      })

      appuser.domain = Promise.resolve(domain)
      appuser.domains = Promise.resolve([domain])
      await getRepository(User).save(appuser)
      // Lazy relation field들에 대한 업데이트. rediculous, 이상의 방법으로 업데이트 해야하는 것 같다.
      // Lazy relation fields : domain, domains
      // Lazy relation 업데이트는 실수 가능성이 높으므로, 사용하지 않기를 권장함.
    }

    var accessToken = Application.generateAccessToken(domain, appuser, appKey)
    var refreshToken = Application.generateRefreshToken(domain, appuser, appKey)

    await getRepository(User).save({
      ...(appuser as any),
      password: accessToken
    })

    debug('exchange - appuser', appuser)

    return [
      accessToken,
      refreshToken,
      {
        /* params */
      }
    ]
  })
)

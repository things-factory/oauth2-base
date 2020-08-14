import Router from 'koa-router'
import { jwtAuthenticateMiddleware } from '@things-factory/auth-base'
import { server as oauth2orizeServer, NonClient } from './oauth2-server'
import { getRepository } from 'typeorm'
import { Application } from '../entities'
import passport from 'koa-passport'
import compose from 'koa-compose'
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password'

const debug = require('debug')('things-factory:oauth2-server:oauth2-router')

export const oauth2Router = new Router()

passport.use(
  'oauth2-client-password',
  new ClientPasswordStrategy((clientId, clientSecret, done) => {
    debug('oauth2-client-password', clientId, clientSecret)

    getRepository(Application)
      .findOne({
        appKey: clientId
      })
      .then(client => {
        if (!client || client.appSecret != clientSecret) {
          done(null, false)
          return
        }

        done(null, client)
      })
      .catch(err => done(err))
  })
)

// user authorization endpoint
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request.  In
// doing so, is recommended that the `redirectURI` be checked against a
// registered value, although security requirements may vary accross
// implementations.  Once validated, the `done` callback must be invoked with
// a `client` instance, as well as the `redirectURI` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction.  It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization).  We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view.

oauth2Router.get(
  '/admin/oauth2/authorize',
  jwtAuthenticateMiddleware,
  oauth2orizeServer.authorize(async function (clientID, redirectURI) {
    const client = await getRepository(Application).findOne({
      appKey: clientID
    })
    // CONFIRM-ME redirectUrl 의 허용 범위는 ?
    // if (!client.redirectUrl != redirectURI) {
    //   return false
    // }

    debug('authorize fetch client', clientID, redirectURI, client)

    return [client || NonClient, redirectURI]
  }),
  async function (context, next) {
    const { oauth2, user, domain } = context.state

    if (!user) {
      debug('authorize - user not found : will redirect to signin page')
      return context.redirect(`/signin?redirect_to=${encodeURIComponent(context.req.url)}`)
    }

    var decisionPage = 'oauth-decision-page'
    if (oauth2.client === NonClient) {
      debug('authorize client not found : will render not found error in the decision page')
      decisionPage = 'oauth-decision-error-page'
    }

    debug('authorize render page', oauth2)

    try {
      await context.render(decisionPage, {
        domain: domain,
        ...oauth2 // client, redirectURI, req { type, clientID, redirectURI, scope, state}, user, transactionID, info, locals
      })
    } catch (e) {
      debug('render decision page error', e)
      throw e
    }
  }
)

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

oauth2Router.post(
  '/admin/oauth2/decision',
  jwtAuthenticateMiddleware,
  compose(
    oauth2orizeServer.decision(function (context) {
      const { request } = context
      return request.body
    })
  )
)

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

oauth2Router.post(
  '/admin/oauth2/access_token',
  passport.authenticate('oauth2-client-password', { session: false }),
  oauth2orizeServer.token(),
  oauth2orizeServer.errorHandler()
)

oauth2Router.get('/admin/oauth2/profile.json', jwtAuthenticateMiddleware, async (context, next) => {
  const { user, domain } = context.state

  debug('getting user/application profile', user, domain)

  const { name, description, email, userType: type, locale } = user
  const { name: domainName, subdomain, brandName, brandImage, contentImage, timezone } = domain || {}

  var application = {}
  if (type == 'application') {
    /* user entity에 reference 필드가 추가되기 전까지, appKey취득 방법임. */
    application['appKey'] = email.substr(0, email.lastIndexOf('@'))
  }

  context.body = {
    profile: {
      name,
      description,
      email,
      type, // 'admin', 'user', 'application', 'appliance'
      domain: {
        name: domainName,
        subdomain,
        brandName,
        brandImage,
        contentImage,
        timezone
      },
      application
    }
  }
})

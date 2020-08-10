import Router from 'koa-router'
import { jwtAuthenticateMiddleware, User } from '@things-factory/auth-base'
import { server as oauth2orizeServer } from '../oauth2'
import { getRepository } from 'typeorm'
import { Application, AuthToken, AuthTokenType } from '../entities'
import passport from 'koa-passport'
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password'
import { Strategy as BearerStrategy } from 'passport-http-bearer'

export const oauth2Router = new Router()

passport.use(
  'oauth2-client-password',
  new ClientPasswordStrategy((clientId, clientSecret, done) => {
    // TODO AuthToken에서 찾아야 함.
    const repository = getRepository(Application)

    repository
      .findOne({
        appKey: clientId
      })
      .then(client => {
        if (!client /*|| client.appSecret != clientSecret*/) {
          done(null, false)
          return
        }

        done(null, client)
      })
      .catch(err => done(err))
  })
)

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(
  'bearer',
  new BearerStrategy((accessToken, done) => {
    const repository = getRepository(AuthToken)

    repository
      .findOne(
        {
          token: accessToken
        },
        { relations: ['domain', 'user'] }
      )
      .then(authToken => {
        const { type, appKey, user } = authToken

        // TODO should check auth type
        // if (!user) {
        //   var info = { scope: '*' }
        //   getRepository(User)
        //     .findOne({
        //       id: userId
        //     })
        //     .then(user => {
        //       done(null, user, info)
        //     })
        //     .catch(err => done(err))
        // } else {
        var info = { scope: '*' }
        // TODO should be a
        getRepository(Application)
          .findOne({
            appKey
          })
          .then(client => {
            done(
              null,
              {
                id: appKey,
                warehouse_owner: client.name,
                name: client.name,
                domain: authToken.domain?.name, // vhost에서 가져오라.
                email: user?.email
              },
              info
            )
          })
          .catch(err => done(err))
        // }
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
  '/admin/oauth/authorize',
  jwtAuthenticateMiddleware,
  oauth2orizeServer.authorize(async function (clientID, redirectURI) {
    const repository = getRepository(Application)

    try {
      const client = await repository.findOne({
        appKey: clientID
      })
      // CONFIRM-ME redirectUrl 의 허용 범위는 ?
      // if (!client.redirectUrl != redirectURI) {
      //   return false
      // }

      // return [client, client.redirectUrl]
      return [client, redirectURI]
    } catch (e) {
      return false
    }
  }),
  async function (context, next) {
    const { oauth2, user } = context.state
    if (!user) {
      return context.redirect(`/signin?redirect_to=${encodeURIComponent(context.req.url)}`)
    }

    await context.render('oauth-decision-page', {
      transactionID: oauth2.transactionID,
      user,
      client: oauth2.client
    })
  }
)

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

oauth2Router.post('/admin/oauth/decision', jwtAuthenticateMiddleware, ...oauth2orizeServer.decision())

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

oauth2Router.post(
  '/admin/oauth/access_token',
  // passport.authenticate('basic', { session: false }),
  // jwtAuthenticateMiddleware,
  passport.authenticate('oauth2-client-password', { session: false }),
  oauth2orizeServer.token(),
  oauth2orizeServer.errorHandler()
)

oauth2Router.get(
  '/admin/warehouse.json',
  passport.authenticate('bearer', { session: false }),
  async (context, next) => {
    var { user: application } = context.state

    context.body = {
      warehouse: application
    }
  }
)

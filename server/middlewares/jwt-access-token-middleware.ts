import passport from 'passport'
import { ExtractJwt, Strategy as JWTstrategy } from 'passport-jwt'
import { AuthToken } from '../entities/auth-token'
import { SECRET } from '@things-factory/auth-base'

const debug = require('debug')('things-factory:oauth2-server:jwt-access-token-middleware')

/* TODO things-factory/auth-base - jwtAuthenticateMiddleware와 통합 : userType으로 로직 분기 */
passport.use(
  new JWTstrategy(
    {
      secretOrKey: SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        /* BearerToken should be ahead of Header */
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromHeader('authorization'),
        ExtractJwt.fromHeader('x-access-token'),
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        req => {
          var token = null
          token = req?.ctx?.cookies?.get('access_token')
          return token
        }
      ])
    },
    async (token, done) => {
      try {
        return done(null, token)
      } catch (error) {
        return done(error)
      }
    }
  )
)

export async function jwtAccessTokenMiddleware(context, next) {
  // API 전용 미들웨어라고 생각. UI 리디렉션이 필요하지 않다고 판단함.
  return await passport.authenticate('jwt', { session: false }, async (err, authObj, info) => {
    if (err || !authObj) {
      context.state.error = err || info
      debug('error - jwt', err, info)

      context.status = 401
      context.body = {
        success: false,
        message: info.message
      }

      return
    }

    try {
      const { domain, user, application } = await AuthToken.checkAuth(authObj)

      context.state.user = user
      context.state.domain = domain
      context.state.application = application
    } catch (e) {
      debug('error - checkAuth', e)

      context.status = 401
      context.body = {
        success: false,
        message: e.toString()
      }

      return
    }

    await next()
  })(context, next)
}

import passport from 'passport'
import { ExtractJwt, Strategy as JWTstrategy } from 'passport-jwt'
import { SECRET, User } from '@things-factory/auth-base'

const debug = require('debug')('things-factory:oauth2-base:jwt-access-token-middleware')

passport.use(
  new JWTstrategy(
    {
      secretOrKey: SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()])
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
  // API 전용 미들웨어이므로, UI 리디렉션이 필요하지 않다.
  return await passport.authenticate('jwt', { session: false }, async (err, authObj, info) => {
    debug('passport.authenticate - jwt', authObj, info)

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
      const user = await User.checkAuth(authObj)

      context.state.user = user
      context.state.domain = await user.domain
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

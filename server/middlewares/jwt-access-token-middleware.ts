import passport from 'passport'
import { ExtractJwt, Strategy as JWTstrategy } from 'passport-jwt'
import { AuthToken } from '../entities/auth-token'
import { SECRET } from '@things-factory/auth-base'

passport.use(
  new JWTstrategy(
    {
      //secret we used to sign our JWT
      secretOrKey: SECRET,
      //we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromHeader('authorization'),
        ExtractJwt.fromHeader('x-access-token'),
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        req => {
          var token = null
          token = req?.ctx?.cookies?.get('access_token')
          console.log('token', token)
          return token
        }
      ])
    },
    async (token, done) => {
      try {
        //Pass the user details to the next middleware
        console.log('token', token)
        return done(null, token)
      } catch (error) {
        return done(error)
      }
    }
  )
)

export async function jwtAccessTokenMiddleware(context, next) {
  return await passport.authenticate('jwt', { session: false }, async (err, authObj, info) => {
    if (err || !authObj) {
      context.state.error = err || info

      if (
        context.method == 'POST'
        // ||
        // (context._matchedRoute == context.path &&
        //   (context.get('sec-fetch-mode') == 'navigate' || context.get('sec-fetch-dest') == 'document'))
      ) {
        context.status = 401
        context.body = {
          success: false,
          message: info.message
        }
        return
      }
      // if (context.header['sec-fetch-mode'] && context.header['sec-fetch-mode'] != 'navigate') {
      //   context.throw(401, {
      //     success: false,
      //     message: error.message
      //   })
      // }

      await next(context.state.error)
    } else {
      try {
        const { domain, user, application } = await AuthToken.checkAuth(authObj)

        context.state.user = user
        context.state.domain = domain
        context.state.application = application
      } catch (e) {
      } finally {
        await next()
      }
    }
  })(context, next)
}

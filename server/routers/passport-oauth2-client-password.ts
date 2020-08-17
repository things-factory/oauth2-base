import passport from 'passport'
import util from 'util'

/**
 * `Oauth2ClientPasswordStrategy` constructor.
 *
 * @api protected
 * Basic Authorization Header와 Body 형식을 모두 지원한다.
 */
export function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options
    options = {}
  }
  if (!verify) throw new Error('OAuth 2.0 client password strategy requires a verify function')

  passport.Strategy.call(this)
  this.name = 'oauth2-client-password'
  this._verify = verify
  this._passReqToCallback = options.passReqToCallback
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy)

function fetchBasicCredential(authorization = '') {
  var parts = authorization.split(' ')
  if (parts.length < 2) {
    return
  }

  var scheme = parts[0]
  var credentials = new Buffer(parts[1], 'base64').toString().split(':')

  if (!/Basic/i.test(scheme)) {
    return
  }
  if (credentials.length < 2) {
    return
  }

  var clientId = credentials[0]
  var clientSecret = credentials[1]
  if (!clientId || !clientSecret) {
    return
  }

  return [clientId, clientSecret]
}

/**
 * Authenticate request based on client credentials in the request body.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function (req) {
  var [clientId, clientSecret] = fetchBasicCredential(req.headers['authorization']) || []
  if (!clientId) {
    if (!req.body || !req.body['client_id'] || !req.body['client_secret']) {
      return this.fail()
    }

    clientId = req.body['client_id']
    clientSecret = req.body['client_secret']
  }

  var self = this

  function verified(err, client, info) {
    if (err) {
      return self.error(err)
    }
    if (!client) {
      return self.fail()
    }
    self.success(client, info)
  }

  if (self._passReqToCallback) {
    this._verify(req, clientId, clientSecret, verified)
  } else {
    this._verify(clientId, clientSecret, verified)
  }
}

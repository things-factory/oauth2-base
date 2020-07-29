import crypto from 'crypto'
export function makeAuthToken(length = 16) {
  return crypto.randomBytes(16).toString('hex')
}

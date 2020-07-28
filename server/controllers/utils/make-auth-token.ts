import crypto from 'crypto'
export function makeAuthToken() {
  return crypto.randomBytes(16).toString('hex')
}

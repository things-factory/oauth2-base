import crypto from 'crypto'
export function makeVerificationToken() {
  return crypto.randomBytes(16).toString('hex')
}

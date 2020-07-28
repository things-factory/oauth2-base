import { getRepository } from 'typeorm'
import { AuthToken, AuthTokenType } from '../../entities'

export async function saveAuthToken(id, token, type = AuthTokenType.ACTIVATION) {
  const authTokenRepo = getRepository(AuthToken)
  return await authTokenRepo.save({
    userId: id,
    token,
    type
  })
}

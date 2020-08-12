import { getRepository } from 'typeorm'
import { AuthToken } from '../../../entities'

export const deleteAuthToken = {
  async deleteAuthToken(_: any, { id }, context: any) {
    await getRepository(AuthToken).delete({ id })
    return true
  }
}

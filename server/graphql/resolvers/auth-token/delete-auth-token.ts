import { getRepository } from 'typeorm'
import { AuthToken } from '../../../entities'

export const deleteAuthToken = {
  async deleteAuthToken(_: any, { name }, context: any) {
    await getRepository(AuthToken).delete({ domain: context.state.domain, name })
    return true
  }
}


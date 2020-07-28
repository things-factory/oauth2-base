import { getRepository } from 'typeorm'
import { AuthToken } from '../../../entities'

export const createAuthToken = {
  async createAuthToken(_: any, { authToken}, context: any) {
    return await getRepository(AuthToken).save({
      ...authToken,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}


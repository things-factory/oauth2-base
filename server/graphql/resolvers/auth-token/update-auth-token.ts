import { getRepository } from 'typeorm'
import { AuthToken } from '../../../entities'

export const updateAuthToken = {
  async updateAuthToken(_: any, { name, patch }, context: any) {
    const repository = getRepository(AuthToken)
    const authToken = await repository.findOne({ 
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...authToken,
      ...patch,
      updater: context.state.user
    })
  }
}
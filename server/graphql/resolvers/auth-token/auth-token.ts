import { getRepository } from 'typeorm'
import { AuthToken } from '../../../entities'

export const authTokenResolver = {
  async authToken(_: any, { name }, context: any) {
    const repository = getRepository(AuthToken)

    return await getRepository(AuthToken).findOne({
      where: { domain: context.state.domain, name }, 
      relations: ['domain', 'creator', 'updater']
    })
  }
}


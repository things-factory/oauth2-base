import { getRepository } from 'typeorm'
import { AppToken } from '../../../entities'

export const appTokenResolver = {
  async appToken(_: any, { id }, context: any) {
    const repository = getRepository(AppToken)

    return await getRepository(AppToken).findOne({
      where: { domain: context.state.domain, id },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

import { getRepository } from 'typeorm'
import { User } from '@things-factory/auth-base'

export const appBindingResolver = {
  async appBinding(_: any, { id }, context: any) {
    const { domain } = context.state

    return await getRepository(User).findOne({
      where: { domain, id },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

import { getRepository } from 'typeorm'
import { User } from '@things-factory/auth-base'

export const appBindingResolver = {
  async appBinding(_: any, { id }, context: any) {
    const { domain } = context.state

    const user: User = await getRepository(User).findOne({
      where: { domain, id },
      relations: ['domain', 'roles', 'creator', 'updater']
    })

    user.scope = user.roles.map(role => role.name).join(' ')

    return user
  }
}

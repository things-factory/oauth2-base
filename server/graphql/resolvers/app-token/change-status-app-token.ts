import { getRepository } from 'typeorm'
import { AppToken } from '../../../entities'

export const changeStatusAppToken = {
  async changeStatusAppToken(_: any, { name, status }, context: any) {
    const repository = getRepository(AppToken)
    const appToken = await repository.findOne({
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...appToken,
      status,
      updater: context.state.user
    })
  }
}

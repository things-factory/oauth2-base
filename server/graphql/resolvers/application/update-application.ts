import { getRepository } from 'typeorm'
import { Application } from '../../../entities'

export const updateApplication = {
  async updateApplication(_: any, { name, patch }, context: any) {
    const repository = getRepository(Application)
    const application = await repository.findOne({
      where: { name }
    })

    return await repository.save({
      ...application,
      ...patch,
      updater: context.state.user
    })
  }
}

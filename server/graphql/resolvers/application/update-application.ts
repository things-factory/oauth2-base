import { getRepository } from 'typeorm'
import { Application } from '../../../entities'

export const updateApplication = {
  async updateApplication(_: any, { id, patch }, context: any) {
    const repository = getRepository(Application)
    const application = await repository.findOne(id)

    return await repository.save({
      ...application,
      ...patch,
      updater: context.state.user
    })
  }
}

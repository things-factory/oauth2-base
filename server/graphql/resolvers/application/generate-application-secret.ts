import { getRepository } from 'typeorm'
import { Application } from '../../../entities'

export const generateApplicationSecret = {
  async generateApplicationSecret(_: any, { id }, context: any) {
    const repository = getRepository(Application)
    const application = await repository.findOne(id)

    return await repository.save({
      ...application,
      appSecret: Application.generateAppSecret(),
      updater: context.state.user
    })
  }
}

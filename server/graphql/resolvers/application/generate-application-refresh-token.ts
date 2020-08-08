import { getRepository } from 'typeorm'
import { Application } from '../../../entities'

export const generateApplicationRefreshToken = {
  async generateApplicationRefreshToken(_: any, { id }, context: any) {
    const repository = getRepository(Application)
    const application = await repository.findOne(id)

    return await repository.save({
      ...application,
      refreshToken: Application.generateAppSecret(),
      updater: context.state.user
    })
  }
}

import { getRepository } from 'typeorm'
import { Application } from '../../../entities'

export const createApplication = {
  async createApplication(_: any, { application }, context: any) {
    return await getRepository(Application).save({
      ...application,
      appSecret: Application.generateAppSecret(),
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

import { getRepository } from 'typeorm'
import { Application } from '../../../entities'

export const applicationResolver = {
  async application(_: any, { id }, context: any) {
    const repository = getRepository(Application)

    return await repository.findOne(id, {
      relations: ['creator', 'updater']
    })
  }
}

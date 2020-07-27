import { getRepository } from 'typeorm'
import { Application } from '../../../entities'

export const applicationResolver = {
  async application(_: any, { name }, context: any) {
    const repository = getRepository(Application)

    return await repository.findOne({
      where: { name },
      relations: ['creator', 'updater']
    })
  }
}

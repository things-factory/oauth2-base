import { getRepository } from 'typeorm'
import { Application } from '../../../entities'

export const deleteApplication = {
  async deleteApplication(_: any, { id }, context: any) {
    await getRepository(Application).delete(id)
    return true
  }
}

import { getRepository, In } from 'typeorm'
import { Application } from '../../../entities'

export const deleteApplications = {
  async deleteApplications(_: any, { ids }, context: any) {
    await getRepository(Application).delete({
      id: In(ids)
    })
    return true
  }
}

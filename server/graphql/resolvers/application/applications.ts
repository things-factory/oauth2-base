import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Application } from '../../../entities'

export const applicationsResolver = {
  async applications(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(Application).findAndCount({
      ...convertedParams,
      relations: ['creator', 'updater']
    })
    return { items, total }
  }
}

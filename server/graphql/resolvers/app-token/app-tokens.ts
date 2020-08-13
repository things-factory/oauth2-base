import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { AppToken } from '../../../entities'

export const appTokensResolver = {
  async appTokens(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(AppToken).findAndCount({
      ...convertedParams,
      relations: ['domain', 'application', 'user', 'creator', 'updater']
    })

    return { items, total }
  }
}

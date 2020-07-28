import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { AuthToken } from '../../../entities'

export const authTokensResolver = {
  async authTokens(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(AuthToken).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })
    return { items, total }
  }
}
import { ListParam, convertListParams } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'
import { getRepository } from 'typeorm'

export const appBindingsResolver = {
  async appBindings(_: any, params: ListParam, context: any) {
    const { domain } = context.state
    // TODO 해당 도메인내에 userType = 'application' 인 user 리스트를 구해야 함.

    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(User).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })

    return { items, total }
  }
}

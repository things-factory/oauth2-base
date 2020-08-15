import { ListParam, convertListParams } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'
import { Application } from '../../../entities'

import { getRepository } from 'typeorm'

export const appBindingsResolver = {
  async appBindings(_: any, params: ListParam, context: any) {
    const { domain } = context.state
    // TODO 해당 도메인내에 userType = 'application' 인 user 리스트를 구해야 함.

    const convertedParams = convertListParams(params)
    convertedParams.where = {
      ...convertedParams.where,
      userType: 'application'
    }

    const [items, total] = await getRepository(User).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })

    var boundApps = await Promise.all(
      items
        .filter((user: User) => user.userType == 'application')
        .map(async (user: User) => {
          const email = user.email
          const appKey = email.substr(0, email.lastIndexOf('@'))
          user.application = await getRepository(Application).findOne({
            appKey
          })

          return user
        })
    )

    return { items: boundApps, total: boundApps.length }
  }
}

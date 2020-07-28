import { getRepository, In } from 'typeorm'
import { AuthToken } from '../../../entities'

export const deleteAuthTokens = {
  async deleteAuthTokens(_: any, { names }, context: any) {
    await getRepository(AuthToken).delete({ 
        domain: context.state.domain,
        name: In(names)
    })
    return true
  }
}


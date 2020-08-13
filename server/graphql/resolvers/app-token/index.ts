import { appTokenResolver } from './app-token'
import { appTokensResolver } from './app-tokens'

import { changeStatusAppToken } from './change-status-app-token'

export const Query = {
  ...appTokensResolver,
  ...appTokenResolver
}

export const Mutation = {
  ...changeStatusAppToken
}

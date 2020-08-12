import { authTokenResolver } from './auth-token'
import { authTokensResolver } from './auth-tokens'

import { updateAuthToken } from './update-auth-token'
import { updateMultipleAuthToken } from './update-multiple-auth-token'
import { createAuthToken } from './create-auth-token'
import { deleteAuthToken } from './delete-auth-token'

export const Query = {
  ...authTokensResolver,
  ...authTokenResolver
}

export const Mutation = {
  ...updateAuthToken,
  ...updateMultipleAuthToken,
  ...createAuthToken,
  ...deleteAuthToken
}

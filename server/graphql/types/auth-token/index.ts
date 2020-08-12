import { AuthToken } from './auth-token'
import { NewAuthToken } from './new-auth-token'
import { AuthTokenPatch } from './auth-token-patch'
import { AuthTokenList } from './auth-token-list'

export const Mutation = `
  createAuthToken (
    authToken: NewAuthToken!
  ): AuthToken

  updateAuthToken (
    name: String!
    patch: AuthTokenPatch!
  ): AuthToken

  updateMultipleAuthToken (
    patches: [AuthTokenPatch]!
  ): [AuthToken]

  deleteAuthToken (
    name: String!
  ): Boolean
`

export const Query = `
  authTokens(filters: [Filter], pagination: Pagination, sortings: [Sorting]): AuthTokenList
  authToken(name: String!): AuthToken
`

export const Types = [AuthToken, NewAuthToken, AuthTokenPatch, AuthTokenList]

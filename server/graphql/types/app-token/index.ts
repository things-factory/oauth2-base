import { AppToken } from './app-token'
import { AppTokenList } from './app-token-list'

export const Mutation = `
  changeStatusAppToken(id: String!, status: String!): AppToken
`

export const Query = `
  appTokens(filters: [Filter], pagination: Pagination, sortings: [Sorting]): AppTokenList
  appToken(id: String!): AppToken
`

export const Types = [AppToken, AppTokenList]

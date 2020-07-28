import gql from 'graphql-tag'

export const AuthTokenList = gql`
  type AuthTokenList {
    items: [AuthToken]
    total: Int
  }
`

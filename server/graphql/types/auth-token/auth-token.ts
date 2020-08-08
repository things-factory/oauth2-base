import gql from 'graphql-tag'

export const AuthToken = gql`
  type AuthToken {
    id: String
    domain: Domain
    name: String
    description: String
    userId: String
    type: String
    token: String
    scope: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`

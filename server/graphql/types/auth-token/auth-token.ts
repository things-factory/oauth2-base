import gql from 'graphql-tag'

export const AuthToken = gql`
  type AuthToken {
    id: String
    name: String
    domain: Domain
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

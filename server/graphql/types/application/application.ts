import gql from 'graphql-tag'

export const Application = gql`
  type Application {
    id: String
    name: String
    description: String
    email: String
    url: String
    icon: String
    redirectUrl: String
    webhook: String
    appKey: String
    appSecret: String
    refreshToken: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`

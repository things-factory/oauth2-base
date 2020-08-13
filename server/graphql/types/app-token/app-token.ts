import gql from 'graphql-tag'

export const AppToken = gql`
  type AppToken {
    id: String
    domain: Domain
    application: Application
    user: User
    status: String
    authcode: String
    accessToken: String
    refreshToken: String
    scope: String
    redirectUrl: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`

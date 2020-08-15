import gql from 'graphql-tag'

export const AppBinding = gql`
  type AppBinding {
    id: String
    domain: Domain
    application: Application
    user: User
    status: String
    scope: String
    redirectUrl: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`

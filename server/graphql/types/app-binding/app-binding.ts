import gql from 'graphql-tag'

export const AppBinding = gql`
  type AppBinding {
    id: String
    name: String
    description: String
    domain: Domain
    application: Application
    status: String
    scope: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`

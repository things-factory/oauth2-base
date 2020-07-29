import gql from 'graphql-tag'

export const ApplicationPatch = gql`
  input ApplicationPatch {
    id: String!
    name: String
    description: String
    email: String
    url: String
    icon: String
    redirectUrl: String
    webhook: String
    cuFlag: String
  }
`

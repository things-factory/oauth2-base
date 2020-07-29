import gql from 'graphql-tag'

export const ApplicationPatch = gql`
  input ApplicationPatch {
    name: String
    description: String
    email: String
    url: String
    icon: String
    redirectUrl: String
    webhook: String
  }
`

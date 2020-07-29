import gql from 'graphql-tag'

export const NewApplication = gql`
  input NewApplication {
    name: String!
    description: String
    email: String
    url: String
    icon: String
    redirectUrl: String
    webhook: String
  }
`

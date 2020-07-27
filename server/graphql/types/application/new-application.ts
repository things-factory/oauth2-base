import gql from 'graphql-tag'

export const NewApplication = gql`
  input NewApplication {
    name: String!
    description: String
    email: String
    icon: String
    redirectUrl: String
    webhookUrl: String
  }
`

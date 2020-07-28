import gql from 'graphql-tag'

export const NewAuthToken = gql`
  input NewAuthToken {
    name: String!
    description: String
  }
`

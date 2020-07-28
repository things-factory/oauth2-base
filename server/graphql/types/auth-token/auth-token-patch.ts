import gql from 'graphql-tag'

export const AuthTokenPatch = gql`
  input AuthTokenPatch {
    id: String
    name: String
    description: String
    cuFlag: String
  }
`

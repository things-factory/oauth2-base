import gql from 'graphql-tag'

export const ApplicationPatch = gql`
  input ApplicationPatch {
    id: String
    name: String
    description: String
    cuFlag: String
  }
`

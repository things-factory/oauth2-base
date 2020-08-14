import gql from 'graphql-tag'

export const AppBindingList = gql`
  type AppBindingList {
    items: [AppBinding]
    total: Int
  }
`

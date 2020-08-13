import gql from 'graphql-tag'

export const AppTokenList = gql`
  type AppTokenList {
    items: [AppToken]
    total: Int
  }
`

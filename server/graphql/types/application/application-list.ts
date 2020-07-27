import gql from 'graphql-tag'

export const ApplicationList = gql`
  type ApplicationList {
    items: [Application]
    total: Int
  }
`

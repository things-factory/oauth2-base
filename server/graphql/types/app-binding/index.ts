import { AppBinding } from './app-binding'
import { AppBindingList } from './app-binding-list'

export const Mutation = ``

export const Query = `
  appBindings(filters: [Filter], pagination: Pagination, sortings: [Sorting]): AppBindingList
  appBinding(id: String!): AppBinding
`

export const Types = [AppBinding, AppBindingList]

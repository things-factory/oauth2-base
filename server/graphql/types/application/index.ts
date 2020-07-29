import { Application } from './application'
import { NewApplication } from './new-application'
import { ApplicationPatch } from './application-patch'
import { ApplicationList } from './application-list'

export const Mutation = `
  createApplication (
    application: NewApplication!
  ): Application

  updateApplication (
    id: String!
    patch: ApplicationPatch!
  ): Application

  updateMultipleApplication (
    patches: [ApplicationPatch]!
  ): [Application]

  deleteApplication (
    id: String!
  ): Boolean

  deleteApplications (
    ids: [String]!
  ): Boolean
`

export const Query = `
  applications(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ApplicationList
  application(id: String!): Application
`

export const Types = [Application, NewApplication, ApplicationPatch, ApplicationList]

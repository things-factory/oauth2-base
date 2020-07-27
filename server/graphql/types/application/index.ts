import { Application } from './application'
import { NewApplication } from './new-application'
import { ApplicationPatch } from './application-patch'
import { ApplicationList } from './application-list'

export const Mutation = `
  createApplication (
    application: NewApplication!
  ): Application

  updateApplication (
    name: String!
    patch: ApplicationPatch!
  ): Application

  updateMultipleApplication (
    patches: [ApplicationPatch]!
  ): [Application]

  deleteApplication (
    name: String!
  ): Boolean

  deleteApplications (
    names: [String]!
  ): Boolean
`

export const Query = `
  applications(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ApplicationList
  application(name: String!): Application
`

export const Types = [Application, NewApplication, ApplicationPatch, ApplicationList]

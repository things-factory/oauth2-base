import * as Application from './application'
import * as AppToken from './app-token'

export const queries = [Application.Query, AppToken.Query]

export const mutations = [Application.Mutation, AppToken.Mutation]

export const types = [...Application.Types, ...AppToken.Types]

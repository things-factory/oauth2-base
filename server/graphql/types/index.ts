import * as Application from './application'
import * as AppBinding from './app-binding'

export const queries = [Application.Query, AppBinding.Query]

export const mutations = [Application.Mutation, AppBinding.Mutation]

export const types = [...Application.Types, ...AppBinding.Types]

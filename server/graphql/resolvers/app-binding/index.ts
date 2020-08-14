import { appBindingResolver } from './app-binding'
import { appBindingsResolver } from './app-bindings'

export const Query = {
  ...appBindingsResolver,
  ...appBindingResolver
}

export const Mutation = {}

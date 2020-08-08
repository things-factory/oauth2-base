import { applicationResolver } from './application'
import { applicationsResolver } from './applications'

import { updateApplication } from './update-application'
import { createApplication } from './create-application'
import { deleteApplication } from './delete-application'
import { generateApplicationSecret } from './generate-application-secret'

export const Query = {
  ...applicationsResolver,
  ...applicationResolver
}

export const Mutation = {
  ...updateApplication,
  ...createApplication,
  ...deleteApplication,
  ...generateApplicationSecret
}

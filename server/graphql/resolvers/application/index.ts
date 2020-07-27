import { applicationResolver } from './application'
import { applicationsResolver } from './applications'

import { updateApplication } from './update-application'
import { updateMultipleApplication } from './update-multiple-application'
import { createApplication } from './create-application'
import { deleteApplication } from './delete-application'
import { deleteApplications } from './delete-applications'

export const Query = {
  ...applicationsResolver,
  ...applicationResolver
}

export const Mutation = {
  ...updateApplication,
  ...updateMultipleApplication,
  ...createApplication,
  ...deleteApplication,
  ...deleteApplications
}

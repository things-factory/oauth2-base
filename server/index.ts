export * from './entities'
export * from './migrations'
export * from './graphql'

import './middlewares'
import './routes'

process.on('bootstrap-module-start' as any, async ({ app, config, client }: any) => {})

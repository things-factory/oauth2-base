export * from './entities'
export * from './migrations'
export * from './graphql'
export * from './middlewares'

import './routes'

process.on('bootstrap-module-start' as any, async ({ app, config, client }: any) => {})

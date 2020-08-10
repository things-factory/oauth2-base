import Router from 'koa-router'

export const vhostRouter = new Router()

// get foo.bar.example.com
vhostRouter.get('/xxx', async ctx => {
  // in body will stand "foo bar"
  ctx.body = ctx.state.wildcardSubdomains.join(' ')
})

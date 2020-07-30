import route from './client/route'
import bootstrap from './client/bootstrap'

export default {
  route,
  routes: [
    {
      tagname: 'oauth-dialog',
      page: 'oauth-dialog'
    },
    {
      tagname: 'application-page',
      page: 'application'
    },
    {
      tagname: 'applications-page',
      page: 'applications'
    },
    {
      tagname: 'register-app',
      page: 'register-app'
    }
  ],
  bootstrap
}

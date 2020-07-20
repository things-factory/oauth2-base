export default function route(page) {
  switch (page) {
    case '':
      return '/oauth2-server-main'

    case 'oauth2-server-main':
      import('./pages/main')
      return page
  }
}

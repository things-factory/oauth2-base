import { store } from '@things-factory/shell'
import oauth2Server from './reducers/main'

export default function bootstrap() {
  store.addReducers({
    oauth2Server
  })
}

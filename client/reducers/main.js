import { UPDATE_OAUTH_2_SERVER } from '../actions/main'

const INITIAL_STATE = {
  oauth2Server: 'ABC'
}

const oauth2Server = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_OAUTH_2_SERVER:
      return { ...state }

    default:
      return state
  }
}

export default oauth2Server

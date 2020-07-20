import { html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'

import logo from '../../assets/images/hatiolab-logo.png'

class Oauth2ServerMain extends connect(store)(PageView) {
  static get properties() {
    return {
      oauth2Server: String
    }
  }
  render() {
    return html`
      <section>
        <h2>Oauth2Server</h2>
        <img src=${logo}></img>
      </section>
    `
  }

  stateChanged(state) {
    this.oauth2Server = state.oauth2Server.state_main
  }
}

window.customElements.define('oauth2-server-main', Oauth2ServerMain)

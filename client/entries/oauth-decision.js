import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-textfield'
import { auth } from '@things-factory/auth-base'
import { i18next, localize } from '@things-factory/i18n-base'
import '@things-factory/i18n-ui/client/components/i18n-selector'
import '@things-factory/layout-ui/client/layouts/snack-bar'
import { css, html, LitElement } from 'lit-element'
import { AUTH_STYLE_SIGN } from '../auth-style-sign'

export class OauthDecision extends localize(i18next)(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          overflow: hidden;

          display: flex;
          flex-direction: row;

          width: 100vw;
          height: 100vh;
        }

        [hidden] {
          display: none;
        }

        #snackbar {
          width: 100%;
        }

        /* Wide layout */
        @media (min-width: 460px) {
        }

        @media print {
          :host {
            width: 100%;
            height: 100%;
            min-height: 100vh;
          }
        }
      `,
      AUTH_STYLE_SIGN
    ]
  }

  static get properties() {
    return {
      params: Object
    }
  }

  render() {
    var { icon, title, description } = this.applicationMeta
    var { client_id } = this.params || {}
    var { email } = auth.credential || {}

    return html`
      <div class="wrap">
        <div class="auth-brand">
          <span class="name">${title}</span>
          <span class="welcome-msg">${description}</span>
          <p>Hi ${email} ?</p>
          <p><b>${client_id}</b> is requesting access to your account.</p>
          <p>Do you approve?</p>
        </div>

        <div class="auth-form">
          <h3><i18n-msg msgid="title.${this.pageName}"></i18n-msg></h3>

          <form id="form" action="/admin/oauth/decision" method="POST">
            <input name="transaction_id" type="hidden" value="<%= transactionID %>" />

            <select id="auth-type" name="authType" required>
              <option value="customer">customer</option>
              <option value="express">express partner</option>
            </select>

            <mwc-button id="submit-allow" class="ui button" type="submit" raised @click=${e => this._onSubmit(e)}>
              <i18n-msg msgid="button.allow"></i18n-msg>
            </mwc-button>

            <mwc-button
              id="submit-deny"
              class="ui button"
              name="cancel"
              type="submit"
              raised
              @click=${e => this._onSubmit(e)}
            >
              <i18n-msg msgid="button.cancel"></i18n-msg>
            </mwc-button>
          </form>
        </div>
      </div>
    `
  }

  firstUpdated() {
    // this.renderRoot.querySelector('mwc-textfield').focus() // not working...

    this.formEl.reset = () => {
      this.formElements.filter(el => !(el.hidden || el.type == 'hidden')).forEach(el => (el.value = ''))
    }

    /* TODO QueryString 의 변경에 따라, pageUpdated 에서 처리할 내용임. */
    // this.params = {
    //   response_type: 'code',
    //   redirect_uri: 'http://localhost:3002/auth/things-factory/F1596633495826',
    //   scope: 'read_orders',
    //   client_id: '20143978290-1834'
    // }
    const searchParams = new URLSearchParams(location.search)

    var params = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })

    this.params = params

    console.log('params', location.search, this.params)

    // TODO client_id로부터 client 정보를 가져와라.
  }

  updated(changed) {}

  get pageName() {
    return 'oauth decision'
  }

  get formEl() {
    return this.renderRoot.querySelector('#form')
  }

  get formElements() {
    return Array.from(this.formEl.querySelectorAll('[name]'))
  }

  get applicationMeta() {
    if (!this._applicationMeta) {
      var iconLink = document.querySelector('link[rel="application-icon"]')
      var titleMeta = document.querySelector('meta[name="application-name"]')
      var descriptionMeta = document.querySelector('meta[name="application-description"]')

      this._applicationMeta = {
        icon: iconLink ? iconLink.href : logo,
        title: titleMeta ? titleMeta.content : 'Things Factory',
        description: descriptionMeta ? descriptionMeta.content : 'Reimagining Software'
      }
    }

    return this._applicationMeta
  }
}

window.customElements.define('oauth-decision', OauthDecision)

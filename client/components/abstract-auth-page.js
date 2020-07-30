import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-textfield'
import { auth } from '@things-factory/auth-base'
import { i18next, localize } from '@things-factory/i18n-base'
import '@things-factory/i18n-ui/client/components/i18n-selector'
import '@things-factory/layout-ui/client/layouts/snack-bar'
import { css, html, LitElement } from 'lit-element'
import { AUTH_STYLE_SIGN } from '../auth-style-sign'

export class AbstractAuthPage extends localize(i18next)(LitElement) {
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
      data: Object,
      message: String,
      detail: Object,
      redirectTo: String
    }
  }

  render() {
    var { icon, title, description } = this.applicationMeta

    return html`
      <div class="wrap">
        <div class="auth-brand">
          <span class="name">${title}</span>
          <span class="welcome-msg">${description}</span>
        </div>

        <div class="auth-form">
          <h3><i18n-msg msgid="title.${this.pageName}"></i18n-msg></h3>

          <form
            id="form"
            action="${this.actionUrl}"
            method="POST"
            @keypress=${e => {
              if (e.key == 'Enter') this._onSubmit(e)
            }}
          >
            <input id="locale-input" type="hidden" name="locale" .value="${i18next.language}" />
            ${this.formfields}
          </form>
          ${this.links}
          <div id="locale-area">
            <label for="locale-selector"><mwc-icon>language</mwc-icon></label>
            <i18n-selector
              id="locale-selector"
              value=${i18next.language || 'en-US'}
              @change=${e => {
                var locale = e.detail
                if (!locale) return

                var localeInput = this.renderRoot.querySelector('#locale-input')
                localeInput.value = locale

                i18next.changeLanguage(locale)
              }}
            ></i18n-selector>
          </div>
        </div>
      </div>
      <snack-bar
        id="snackbar"
        level="error"
        .message="${i18next.t(`text.${this.message}`, {
          ...this.detail
        })}"
      ></snack-bar>
    `
  }

  firstUpdated() {
    this.renderRoot.querySelector('mwc-textfield').focus() // not working...

    this.formEl.reset = () => {
      this.formElements.filter(el => !(el.hidden || el.type == 'hidden')).forEach(el => (el.value = ''))
    }
  }

  updated(changed) {
    if (changed.has('data') && this.data) {
      this.message = this.data.message
      this.detail = this.data.detail
      this.redirectTo = this.data.redirectTo
    }
  }

  get pageName() {}

  get formEl() {
    return this.renderRoot.querySelector('#form')
  }

  get formElements() {
    return Array.from(this.formEl.querySelectorAll('[name]'))
  }

  get formfields() {
    return html`
      <input id="email" type="hidden" name="email" />
      <input id="password" type="hidden" name="password" />
      <input id="redirect_to" type="hidden" name="redirect_to" value="${this.redirectTo || ''}" />

      <div class="field">
        <mwc-textfield
          name="email"
          type="email"
          label=${i18next.t('field.email')}
          required
          @input=${e => {
            var emailInput = this.renderRoot.querySelector('#email')
            emailInput.value = e.target.value
          }}
        ></mwc-textfield>
      </div>
      <div class="field">
        <mwc-textfield
          name="password"
          type="password"
          label=${i18next.t('field.password')}
          required
          @input=${e => {
            var passwordInput = this.renderRoot.querySelector('#password')
            passwordInput.value = e.target.value
          }}
        ></mwc-textfield>
      </div>

      <mwc-button class="ui button" type="submit" raised @click=${e => this._onSubmit(e)}>
        <i18n-msg msgid="field.${this.pageName}"> </i18n-msg>
      </mwc-button>
    `
  }

  get links() {
    return html`
      <a class="link" href=${auth.fullpage(auth.signupPage)}>
        <mwc-button><i18n-msg msgid="field.sign up"></i18n-msg></mwc-button>
      </a>
      <a class="link" href=${auth.fullpage(auth.forgotPasswordPage)}>
        <mwc-button><i18n-msg msgid="field.forgot-password"></i18n-msg></mwc-button>
      </a>
    `
  }

  async _onSubmit(e) {
    if (this.checkValidity()) {
      this.submit()
    }
  }

  checkValidity() {
    return this.formElements.every(el => el.checkValidity())
  }

  async submit() {}

  async handleSubmit(e) {}

  showSnackbar({ level, message, timer = 3000 } = {}) {
    const snackbar = this.renderRoot.querySelector('#snackbar')
    if (level) snackbar.level = level
    if (message) snackbar.message = message
    snackbar.active = true

    if (timer > -1)
      setTimeout(() => {
        this.hideSnackbar()
      }, timer)
  }

  hideSnackbar() {
    const snackbar = this.renderRoot.querySelector('#snackbar')
    snackbar.active = false
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

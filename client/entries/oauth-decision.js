import '@material/mwc-button'
import { auth } from '@things-factory/auth-base'
import { i18next } from '@things-factory/i18n-base'
import '@things-factory/layout-ui/client/layouts/snack-bar'
import { html } from 'lit-element'
import { AbstractAuthPage } from '../components/abstract-auth-page'
import '../components/profile-component'
export class OauthDecision extends AbstractAuthPage {
  get pageName() {
    return 'forgot password'
  }

  get actionUrl() {
    return '/forgot-password'
  }

  get formfields() {
    return html`
      <select id="auth-type" name="authType" required>
        <option value="customer">customer</option>
        <option value="express">express partner</option>
      </select>
      <mwc-button id="submit-button" class="ui button" type="submit" raised @click=${e => this._onSubmit(e)}>
        <i18n-msg msgid="button.submit"></i18n-msg>
      </mwc-button>
    `
  }

  get links() {
    return html`
      <a class="link" href=${auth.fullpage(auth.signinPage)}>
        <mwc-button><i18n-msg msgid="field.sign in"></i18n-msg></mwc-button>
      </a>
    `
  }

  async submit() {
    this._handleSubmit(this.formEl)
  }

  async _handleSubmit(form) {
    var timer
    var formData = new FormData(form)
    var button = this.renderRoot.querySelector('#submit-button')

    try {
      var controller = new AbortController()
      var signal = controller.signal

      button.disabled = true
      timer = setTimeout(() => {
        controller.abort()
        throw new Error('timeout')
      }, 30 * 1000)

      var response = await fetch('/forgot-password', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
        signal
      })

      const { status, ok } = response
      let level, message

      if (ok) {
        level = 'info'
        message = 'password reset email sent'
      }

      if (status == 404) {
        level = 'error'
        message = 'email account does not exist'
      }

      this.showSnackbar({
        message,
        level
      })
    } catch (e) {
    } finally {
      button.disabled = false
      clearTimeout(timer)
    }
  }

  showSnackbar({ message, level }) {
    super.showSnackbar({
      level,
      message
    })
  }
}

customElements.define('oauth-decision', OauthDecision)

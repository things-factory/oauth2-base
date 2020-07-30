import '@material/mwc-button'
import { i18next, localize } from '@things-factory/i18n-base'
import '@things-factory/layout-ui/client/layouts/snack-bar'
import { css, html, LitElement } from 'lit-element'

export class AuthActivate extends localize(i18next)(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: 100vh;
          background-color: var(--main-section-background-color);
          --mdc-theme-primary: #fff;
        }
        .wrap {
          margin: auto;
          padding: var(--auth-special-page-padding);
          background: url(/assets/images/icon-activate.png) center 70px no-repeat;
          max-width: 500px;
          text-align: center;
        }
        h1 {
          margin: 0;
          padding: 0;
          font: var(--auth-title-font);
          color: var(--auth-title-color);
        }
        p {
          margin: 0;
          padding: var(--auth-description-padding);
          font: var(--auth-description-font);
          color: var(--auth-description-color);
        }
        #button-area {
          border-top: 1px dashed #ccc;
          padding-top: 10px;
        }
        mwc-button {
          border-radius: var(--border-radius);
          background-color: var(--auth-button-background-color);
          font: var(--auth-button-font);
        }
        mwc-button:hover {
          background-color: var(--auth-button-background-focus-color);
        }
      `
    ]
  }

  static get properties() {
    return {
      data: Object,
      email: String
    }
  }

  render() {
    return html`
      <div class="wrap">
        <h1><i18n-msg msgid="text.your account is not activated"></i18n-msg></h1>

        <!--description message container-->
        <p></p>

        <form
          id="form"
          action="/resend-verification-email"
          method="POST"
          @submit=${e => {
            this._handleSubmit(e)
          }}
          hidden
        >
          <input name="email" type="hidden" .value=${this.email} required />
          <button id="submit-button" type="submit"><i18n-msg msgid="label.change password"></i18n-msg></button>
        </form>
        <div id="button-area">
          <mwc-button label="${i18next.t('label.resend')}" @click=${e => this.requestResend(e)}></mwc-button>
          <mwc-button
            label="${i18next.t('button.go to home')}"
            @click=${e => {
              window.location.replace('/signin')
            }}
          ></mwc-button>
        </div>
        <contact-us></contact-us>
      </div>
      <snack-bar id="snackbar"></snack-bar>
    `
  }

  firstUpdated() {
    var searchParams = new URLSearchParams(window.location.search)
    this.email = searchParams.get('email')
  }

  updated(changed) {
    if (changed.has('data')) {
      this.email = this.data.email
    }
  }

  async requestResend(e) {
    var timer
    var form = this.renderRoot.querySelector('#form')
    var formData = new FormData(form)
    var button = e.target
    try {
      var controller = new AbortController()
      var signal = controller.signal

      button.disabled = true
      timer = setTimeout(() => {
        controller.abort()
        throw new Error('timeout')
      }, 30 * 1000)

      var response = await fetch('/resend-verification-email', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
        signal
      })
      if (response && response.ok) {
        this.showSnackbar({
          level: 'info',
          message: i18next.t('text.verification email resent')
        })
      }
    } catch (e) {
    } finally {
      button.disabled = false
      clearTimeout(timer)
    }
  }

  showSnackbar({ level, message, timer = 3000 }) {
    const snackbar = this.renderRoot.querySelector('#snackbar')
    snackbar.level = level
    snackbar.message = message
    snackbar.active = true

    if (timer > -1)
      setTimeout(() => {
        snackbar.active = false
      }, timer)
  }
}

customElements.define('auth-activate', AuthActivate)

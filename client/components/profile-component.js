import { auth } from '@things-factory/auth-base'
import { i18next, localize } from '@things-factory/i18n-base'
import '@things-factory/i18n-ui/client/components/i18n-selector'
import { openPopup } from '@things-factory/layout-base'
import { css, html, LitElement } from 'lit-element'
import './change-password'
import './delete-account-popup'

export class ProfileComponent extends localize(i18next)(LitElement) {
  static get properties() {
    return {
      email: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: 100%;
          overflow-y: auto;
          background-color: var(--main-section-background-color);
          padding: 15px 0;
        }
        .wrap {
          max-width: var(--profile-wrap-max-width, 400px);
          margin: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        :host *:focus {
          outline: none;
        }
        .user {
          background: url(/assets/images/icon-profile.png) center top no-repeat;
          margin: var(--profile-icon-margin);
          padding: 180px 20px 20px 20px;
          color: var(--secondary-color);
          font: var(--header-bar-title);
          text-align: center;
        }

        hr {
          width: 100%;
          border: dotted 1px rgba(0, 0, 0, 0.1);
        }

        .wrap * {
          grid-column: span 2;
        }

        label {
          font: bold 14px var(--theme-font);
          color: var(--primary-color);
          text-transform: capitalize;
          grid-column: 1;
        }

        .wrap *.inline {
          grid-column: unset;
        }

        i18n-selector {
          --i18n-selector-field-width: var(--auth-input-field-width);
        }

        button {
          background-color: var(--button-background-color);
          margin: var(--button-margin);
          height: var(--button-height);
          border-radius: var(--button-radius);
          border: var(--button-border);
          font: var(--button-font);
          color: var(--button-color);
          cursor: pointer;
        }
        button:hover,
        button:active {
          background-color: var(--button-active-background-color);
        }
        button:active {
          border: var(--button-active-border);
        }

        mwc-button {
          --mdc-theme-primary: var(--status-danger-color)
        }
      `
    ]
  }

  firstUpdated() {
    auth.on('signin', accessToken => {
      this.setCredential(null)
    })
    auth.on('signout', () => {
      this.setCredential(null)
    })
    auth.on('profile', credential => {
      this.setCredential(credential)
    })

    this.setCredential(auth.credential)
  }

  setCredential(credential) {
    if (credential) {
      this.email = credential.email
    } else {
      this.email = ''
    }
  }

  render() {
    return html`
      <div class="wrap">
        <div class="user">
          ${this.email}
        </div>

        <label for="locale"><i18n-msg slot="title" msgid="label.language"></i18n-msg></label>
        <i18n-selector
          id="locale"
          @change=${e => {
            this.onLocaleChanged(e.detail)
          }}
        ></i18n-selector>

        <hr />

        <label for="change-password">
          <i18n-msg msgid="label.password"></i18n-msg>
        </label>
        <change-password id="change-password"></change-password>
        <mwc-button id="delete-account-button" label="${i18next.t('label.delete account')}" raised @click=${e => this.deleteAccount()}></mwc-button>
      </div>
    `
  }

  async onLocaleChanged(value) {
    if (!value) return

    var oldLocale = i18next.language
    var localeEl = this.renderRoot.querySelector('#locale')

    var { success, detail } = await auth.updateProfile({
      locale: value
    })

    if (success) {
      i18next.changeLanguage(value)
    } else {
      localeEl.value = oldLocale
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'error',
            message: detail.message
          }
        })
      )
    }
  }

  deleteAccount() {
    openPopup(html`
      <delete-account-popup></delete-account-popup>
    `)
  }
}

customElements.define('profile-component', ProfileComponent)

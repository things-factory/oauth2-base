import '@material/mwc-button'
import { auth } from '@things-factory/auth-base'
import JWTAuthProvider from '@things-factory/auth-provider-jwt/client/jwt-auth-provider'
import { i18next, localize } from '@things-factory/i18n-base'
import { css, html, LitElement } from 'lit-element'
import '../components/contact-us'
import '../components/profile-component'

export class AuthDomainSelect extends localize(i18next)(LitElement) {
  static get properties() {
    return {
      data: Object,
      domains: Array
    }
  }

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
          background: url(/assets/images/icon-domain.png) center 70px no-repeat;
          max-width: 500px;
          text-align: center;
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

        label {
          font: bold 14px var(--theme-font);
          color: var(--primary-color);
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

        #popup {
          position: fixed;
          box-sizing: border-box;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          padding: 20vmin;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .popup-content {
          position: relative;
          width: 100%;
          height: 100%;
        }

        #close-button {
          position: absolute;
          right: 0;
        }
        select {
          margin: 10px 0px;
          min-width: 200px;
          font: var(--auth-input-font);
        }
      `
    ]
  }

  render() {
    return html`
      <div class="wrap">
        <div id="domain-select-area">
          ${this.domains && this.domains.length
            ? html`
                <h1><i18n-msg msgid="text.select domain"></i18n-msg></h1>

                <select
                  id="domain-select"
                  @change=${e => {
                    var domain = e.target.value
                    if (domain) location.pathname = `/checkin/${domain}/`
                  }}
                >
                  <option value=""></option>
                  ${(this.domains || []).map(
                    domain => html`
                      <option value="${domain.subdomain}">${domain.name}</option>
                    `
                  )}
                </select>
              `
            : html`
                <span><i18n-msg msgid="text.no domain available"></i18n-msg></span>
              `}
        </div>
        <div id="button-area">
          <mwc-button label="${i18next.t('button.logout')}" @click=${e => (window.location.pathname = '/signout')}>
          </mwc-button>
        </div>
      </div>
      <div id="contact-area">
        <contact-us></contact-us>
      </div>
    `
  }

  firstUpdated() {
    auth.authProvider = JWTAuthProvider
  }

  updated(changed) {
    if (changed.has('data')) {
      this.domains = this.data.domains
      this.requestUpdate()
    }
  }

  showProfilePopup() {
    this.renderRoot.querySelector('#popup').hidden = false
  }

  closePopup() {
    this.renderRoot.querySelector('#popup').hidden = true
  }
}

customElements.define('auth-domain-select', AuthDomainSelect)

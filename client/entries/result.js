import '@material/mwc-button'
import { i18next, localize } from '@things-factory/i18n-base'
import { css, html, LitElement } from 'lit-element'
import '../components/profile-component'

export class AuthResult extends localize(i18next)(LitElement) {
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
          background: url(/assets/images/icon-result.png) center 70px no-repeat;
          max-width: 500px;
          text-align: center;
        }

        .wrap.congratulations {
          background-image: url(/assets/images/icon-congratulations.png);
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
      message: String,
      resultType: String
    }
  }

  updated(changed) {
    if (changed.has('data')) {
      this.message = this.data.message
      this.resultType = this.data.resultType || 'congratulations'
    }
  }

  render() {
    return html`
      <div class="wrap ${this.resultType}">
        <div id="message-area">
          <h1><i18n-msg msgid="text.${this.message}"></i18n-msg></h1>

          <!--description message container-->
          <p></p>
        </div>
        <div id="button-area">
          <mwc-button
            label="${i18next.t('button.go to home')}"
            @click=${e => {
              window.location.replace('/signin')
            }}
          ></mwc-button>
        </div>
      </div>
    `
  }
}

customElements.define('auth-result', AuthResult)

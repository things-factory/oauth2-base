import { auth } from '@things-factory/auth-base'
import { i18next, localize } from '@things-factory/i18n-base'
import { css, html, LitElement } from 'lit-element'

export class DeleteAccountPopup extends localize(i18next)(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          background-color: var(--popup-content-background-color);
          padding: var(--popup-content-padding);
        }

        * {
          box-sizing: border-box;
        }
        *:focus {
          outline: none;
        }

        label {
          font: bold 14px var(--theme-font);
          color: var(--primary-color);
        }

        input {
          border: var(--change-password-field-border);
          border-radius: var(--change-password-field-border-radius);
          padding: var(--change-password-field-padding);

          font: var(--change-password-field-font);
          width: var(--change-password-field-width);
        }
        input:focus {
          border: 1px solid var(--focus-background-color);
        }

        div.field {
          padding-bottom: 10px;
        }

        ::placeholder {
          font-size: 0.8rem;
          text-transform: capitalize;
        }

        button {
          background-color: var(--status-danger-color, red);
          margin: 2px 2px 10px 2px;
          height: var(--button-height, 28px);
          color: var(--button-color, #fff);
          font: var(--button-font);
          border-radius: var(--button-radius, 5px);
          border: var(--button-border, 1px solid transparent);
          line-height: 1.5;
        }
        button:hover,
        button:active {
          background-color: var(--button-active-background-color, #22a6a7);
          border: var(--button-active-border);
        }
      `
    ]
  }

  render() {
    return html`
      <h1><i18n-msg msgid="label.delete account"></i18n-msg></h1>
      <span><i18n-msg msgid="text.delete account warning message"></i18n-msg></span>
      <form @submit=${e => this._handleSubmit(e)}>
        <div class="field">
          <label for="email"><i18n-msg msgid="label.email"></i18n-msg></label>
          <input id="email" type="email" name="email" required />
          <label for="password"><i18n-msg msgid="label.password"></i18n-msg></label>
          <input id="password" type="password" name="password" required />
        </div>

        <button class="ui button" type="submit"><i18n-msg msgid="label.delete"></i18n-msg></button>
      </form>
    `
  }

  async _handleSubmit(e) {
    e.preventDefault()

    const form = e.target

    const formData = new FormData(form)
    let json = {}

    //convert form into json
    for (const [key, value] of formData.entries()) {
      json[key] = value
    }

    var { success, detail } = await auth.deleteAccount(json)
    if (success) {
      auth.signout()
    } else {
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'error',
            message: i18next.t(`text.${detail.message}`)
          }
        })
      )
    }

    form.reset()
  }
}

customElements.define('delete-account-popup', DeleteAccountPopup)

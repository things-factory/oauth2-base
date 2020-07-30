import { auth } from '@things-factory/auth-base'
import { i18next, localize } from '@things-factory/i18n-base'
import { css, html, LitElement } from 'lit-element'

export class ChangePassword extends localize(i18next)(LitElement) {
  static get styles() {
    return [
      css`
        * {
          box-sizing: border-box;
        }
        *:focus {
          outline: none;
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
          background-color: var(--secondary-color, #394e64);
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
      <form @submit=${e => this._handleSubmit(e)}>
        <div class="field">
          <input type="password" name="current_pass" placeholder=${i18next.t('text.current password')} required />
        </div>
        <div class="field">
          <input type="password" name="new_pass" placeholder=${i18next.t('text.new password')} required />
        </div>
        <div class="field">
          <input type="password" name="confirm_pass" placeholder=${i18next.t('text.confirm password')} required />
        </div>

        <button class="ui button" type="submit"><i18n-msg msgid="text.change password"></i18n-msg></button>
      </form>
    `
  }

  async _encodeSha256(password) {
    const encoder = new TextEncoder()
    const encoded = encoder.encode(password)

    const buffer = await crypto.subtle.digest('SHA-256', encoded)
    return hexString(buffer)
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

    auth.changePassword(json)

    form.reset()
  }
}

customElements.define('change-password', ChangePassword)

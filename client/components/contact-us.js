import '@material/mwc-textarea'
import '@material/mwc-textfield'
import '@material/mwc-button'
import '@material/mwc-dialog'
import { auth } from '@things-factory/auth-base'
import '@things-factory/i18n-base'
import { i18next, localize } from '@things-factory/i18n-base'
import { css, html, LitElement } from 'lit-element'

export class ContactUs extends localize(i18next)(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          --mdc-theme-primary: var(--primary-color);
        }
        * {
          box-sizing: border-box;
        }
        *:focus {
          outline: none;
        }

        #input-form {
          display: grid;
          grid-template-rows: 1fr 1fr 3fr;
          grid-gap: 10px 0;
        }
      `
    ]
  }

  get dialog() {
    return this.renderRoot.querySelector('#dialog')
  }

  render() {
    return html`
      <mwc-button label=${i18next.t('button.need help')} @click=${e => (this.dialog.open = true)}></mwc-button>
      <mwc-dialog id="dialog" heading=${i18next.t('title.need help')}>
        <form action="" method="POST">
          <input id="subject-input" name="subject" type="hidden" />
          <input id="sender-input" name="sender" type="hidden" />
          <input id="content-input" name="content" type="hidden" />
        </form>
        <div id="input-form">
          <mwc-textfield
            type="text"
            label=${i18next.t('label.subject')}
            dialogInitialFocus
            required
            @input=${e => {
              const val = e.target.value
              this.renderRoot.querySelector('#subject-input').value = val
            }}
          ></mwc-textfield>
          <mwc-textfield
            type="text"
            name="sender"
            label=${i18next.t('label.email')}
            required
            @input=${e => {
              const val = e.target.value
              this.renderRoot.querySelector('#sender-input').value = val
            }}
          ></mwc-textfield>
          <mwc-textarea
            name="content"
            label=${i18next.t('label.content')}
            required
            @keydown=${e => e.stopPropagation()}
            @input=${e => {
              const val = e.target.value
              this.renderRoot.querySelector('#content-input').value = val
            }}
          ></mwc-textarea>
        </div>
        <mwc-button
          slot="primaryAction"
          type="submit"
          label=${i18next.t('button.submit')}
          raised
          @click=${e => this._submit()}
        ></mwc-button>
        <mwc-button slot="secondaryAction" dialogAction="cancel" label=${i18next.t('button.cancel')}></mwc-button>
      </mwc-dialog>
    `
  }

  _checkValidity() {}

  _submit(e) {
    if (!this._checkValidity()) return

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

customElements.define('contact-us', ContactUs)

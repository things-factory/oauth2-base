import { html, css, LitElement } from 'lit-element'
import gql from 'graphql-tag'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { client, store, navigate, PageView } from '@things-factory/shell'

class RegisterApp extends connect(store)(PageView) {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          background-color: var(--main-section-background-color);
          padding: var(--padding-wide);
        }
        h2 {
          margin: var(--title-margin);
          font: var(--title-font);
          color: var(--title-text-color);
        }
        [page-description] {
          margin: var(--page-description-margin);
          font: var(--page-description-font);
          color: var(--page-description-color);
        }
        :host * {
          display: block;
        }
        label {
          font: var(--label-font);
          color: var(--label-color);
          text-transform: var(--label-text-transform);
        }
        input {
          border: var(--border-dark-color);
          border-radius: var(--border-radius);
          margin: var(--input-margin);
          padding: var(--input-padding);
          font: var(--input-font);

          flex: 1;
        }
        select:focus,
        input:focus {
          outline: none;
        }
        [field-2column] {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 15px;
        }
        [field] {
          display: flex;
          flex-direction: column;
        }
        [grid-span] {
          grid-column: span 2;
        }
        [button-primary] {
          background-color: var(--button-primary-background-color);
          border: var(--button-border);
          border-radius: var(--button-border-radius);
          margin: var(--button-margin);
          padding: var(--button-primary-padding);
          color: var(--button-primary-color);
          font: var(--button-primary-font);
          text-transform: var(--button-text-transform);

          text-decoration: none;
        }
        [button-primary]:hover {
          background-color: var(--button-primary-active-background-color);
          box-shadow: var(--button-active-box-shadow);
        }
        @media screen and (max-width: 460px) {
          [field-2column] {
            grid-template-columns: 1fr;
          }
        }
      `
    ]
  }

  static get properties() {
    return {
      application: Object
    }
  }

  render() {
    return html`
      <h2>Register Applications</h2>
      <p page-description>
        Register Applications description
      </p>

      <form>
        <div field-2column>
          <div field grid-span>
            <label for="name">name</label>
            <input id="name" type="text" name="name" />
          </div>

          <div field grid-span>
            <label for="description">description</label>
            <input id="description" type="text" name="description" />
          </div>

          <div field>
            <label for="app-url">app url</label>
            <input id="app-url" type="text" name="url" />
          </div>

          <div field>
            <label for="email">contact email</label>
            <input id="email" type="text" name="email" />
          </div>

          <div field>
            <label for="description">redirectUrl</label>
            <input id="redirect-url" type="text" name="redirectUrl" />
          </div>
        </div>
        <button button-primary @click=${this.createApplication.bind(this)}>create application</button>
      </form>
    `
  }

  async createApplication(e) {
    e.preventDefault()

    const form = this.renderRoot.querySelector('form')
    const formData = new FormData(form)

    const application = Array.from(formData.entries()).reduce((application, [key, value]) => {
      application[key] = value
      return application
    }, {})

    const response = await client.mutate({
      mutation: gql`
        mutation($application: NewApplication!) {
          createApplication(application: $application) {
            id
          }
        }
      `,
      variables: {
        application
      }
    })

    if (response.errors) {
      console.log('creation fail.')
    } else {
      const id = response.data.createApplication.id
      navigate(`application/${id}`)
    }
  }

  updated(changes) {
    /*
     * If this page properties are changed, this callback will be invoked.
     * This callback will be called back only when this page is activated.
     */
    if (changes.has('application')) {
      /* do something */
    }
  }

  stateChanged(state) {
    /*
     * application wide state changed
     *
     */
  }

  /*
   * page lifecycle
   *
   * - pageInitialized(lifecycle)
   * - pageUpdated(changes, lifecycle, changedBefore)
   * - pageDisposed(lifecycle)
   *
   * lifecycle value has
   * - active : this page is activated
   * - page : first path of href
   * - resourceId : second path of href
   * - params : search params object of href
   * - initialized : initialized state of this page
   *
   * you can update lifecycle values, or add custom values
   * by calling this.pageUpdate({ ...values }, force)
   * If lifecycle values changed by this.pageUpdate(...),
   * this.pageUpdated(...) will be called back right after.
   * If you want to invoke this.pageUpdated(...) callback,
   * set force argument to true.
   *
   * you can re-initialize this page
   * by calling this.pageReset().
   * this.pageInitialized(...) followed by this.pageDispose(...) will be invoked
   * by calling this.pageReset().
   *
   * you can invoke this.pageDisposed()
   * by calling this.pageDispose()
   */

  pageInitialized(lifecycle) {
    /*
     * This page is initialized.
     * It's right time to configure of this page.
     *
     * - called before when this page activated first
     * - called when i18next resource is updated (loaded, changed, ..)
     * - called right after this.pageReset()
     */
  }

  pageUpdated(changes, lifecycle, before) {
    if (this.active) {
      /*
       * this page is activated
       */
      this.itemId = lifecycle.resourceId
      this.params = lifecycle.params
    } else {
      /* this page is deactivated */
    }
  }

  pageDisposed(lifecycle) {
    /*
     * This page is disposed.
     * It's right time to release system resources.
     *
     * - called just before (re)pageInitialized
     * - called right after when i18next resource updated (loaded, changed, ..)
     * - called right after this.pageReset()
     * - called right after this.pageDispose()
     */
  }
}

window.customElements.define('register-app', RegisterApp)

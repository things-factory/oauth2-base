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
        :host * {
          display: block;
        }
        form {
          display: grid;
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
      <form>
        <div>
          <label for="name">name</label>
          <input id="name" type="text" name="name" />
        </div>

        <div>
          <label for="description">description</label>
          <input id="description" type="text" name="description" />
        </div>

        <div>
          <label for="app-url">app url</label>
          <input id="app-url" type="text" name="url" />
        </div>

        <div>
          <label for="email">contact email</label>
          <input id="email" type="text" name="email" />
        </div>

        <div>
          <label for="description">redirectUrl</label>
          <input id="redirect-url" type="text" name="redirectUrl" />
        </div>

        <button @click=${this.createApplication.bind(this)}>create application</button>
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

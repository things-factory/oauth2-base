import { html, css, LitElement } from 'lit-element'
import gql from 'graphql-tag'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { client, store, PageView } from '@things-factory/shell'

class AppSetup extends connect(store)(PageView) {
  static get styles() {
    return [
      css`
        :host * {
          display: block;
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
    var app = this.application || {}
    return html`
      <form>
        <label for="name">app name</label>
        <input id="name" type="text" name="name" .value=${app.name} />

        <label for="description">description</label>
        <input id="description" type="text" name="description" .value=${app.description} />

        <label for="email">api contact email</label>
        <input id="email" type="text" name="email" .value=${app.email} />

        <label for="url">app url</label>
        <input id="url" type="text" name="url" .value=${app.url} />

        <label for="icon">icon</label>
        <input id="icon" type="text" name="icon" .value=${app.icon} />

        <label for="redirect-url">redirectUrl</label>
        <input id="redirect-url" type="text" name="redirectUrl" .value=${app.redirectUrl} />

        <label for="webhook">webhook</label>
        <input id="webhook" type="text" name="webhook" .value=${app.webhook} />
      </form>
      <button @click=${this.submit.bind(this)}>submit</button>
    `
  }

  async submit(e) {
    e.preventDefault()

    const form = this.renderRoot.querySelector('form')
    const formData = new FormData(form)

    const name = formData.get('name')
    const description = formData.get('description')
    const email = formData.get('email')
    const url = formData.get('url')
    const icon = formData.get('icon')
    const redirectUrl = formData.get('redirect-url')
    const webhook = formData.get('webhook')

    const application = {
      name,
      description,
      email,
      url,
      icon,
      redirectUrl,
      webhook
    }

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

    this.application = response.data.createApplication
  }

  updated(changes) {
    /*
     * If this page properties are changed, this callback will be invoked.
     * This callback will be called back only when this page is activated.
     */
    if (changes.has('AppSetup')) {
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

  async pageUpdated(changes, lifecycle, before) {
    if (this.active) {
      /*
       * this page is activated
       */
      this.application = await this.fetchApplication()
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

  async fetchApplication() {
    const response = await client.query({
      query: gql`
        query($id: String!) {
          application(id: $id) {
            id
            name
            description
          }
        }
      `,
      variables: {
        id: this.lifecycle.resourceId
      }
    })

    if (!response.errors) {
      return response.data.application
    }
  }
}

window.customElements.define('app-setup', AppSetup)

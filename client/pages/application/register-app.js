import { html, LitElement } from 'lit-element'
import gql from 'graphql-tag'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { client, store, PageView } from '@things-factory/shell'

class RegisterApp extends connect(store)(PageView) {
  static get properties() {
    return {
      application: Object
    }
  }

  render() {
    return html`
      <form>
        <label for="name">name</label>
        <input id="name" type="text" name="name" />

        <label for="description">description</label>
        <input id="description" type="text" name="description" />

        <label>email</label>
        <input id="email" type="text" name="email" />

        <label>icon</label>
        <input id="icon" type="text" name="icon" />

        <label>redirectUrl</label>
        <input id="redirectUrl" type="text" name="redirectUrl" />

        <label>webhookUrl</label>
        <input id="webhookUrl" type="text" name="webhookUrl" />
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
    const icon = formData.get('icon')
    const redirectUrl = formData.get('redirectUrl')
    const webhookUrl = formData.get('webhookUrl')

    const application = {
      name,
      description,
      email,
      icon,
      redirectUrl,
      webhookUrl
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
    if (changes.has('registerApp')) {
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

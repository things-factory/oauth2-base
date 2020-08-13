import { html, css, LitElement } from 'lit-element'
import gql from 'graphql-tag'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { client, store, PageView } from '@things-factory/shell'

class AppToken extends connect(store)(PageView) {
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
      appToken: Object
    }
  }

  render() {
    var app = this.appToken || {}
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

        <br />
        <h3>app credentials</h3>

        <label for="app-key">appKey</label>
        <input id="app-key" type="text" name="appKey" .value=${app.appKey} disabled />
        <button>copy appKey</button>

        <label for="app-secret">appSecret</label>
        <input id="app-secret" type="text" name="appSecret" .value=${app.appSecret} disabled />
        <div>created 6 days ago</div>
        <button>copy app-secret</button>

        <label for="refresh-token">refresh token</label>
        <input id="refresh-token" type="text" name="refreshToken" .value=${app.refreshToken} disabled />
        <div>expires 1 hour</div>
        <button>copy refresh token</button>

        <button>generate new secret</button>
        <button>generate new refresh token</button>

        <button @click=${this.updateAppToken.bind(this)}>update</button>
        <button @click=${this.deleteAppToken.bind(this)}>delete this app</button>
      </form>
    `
  }

  updated(changes) {
    /*
     * If this page properties are changed, this callback will be invoked.
     * This callback will be called back only when this page is activated.
     */
    if (changes.has('appToken')) {
      /* do something */
    }
  }

  stateChanged(state) {
    /*
     * appToken wide state changed
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
      await this.fetchAppToken()
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

  async fetchAppToken() {
    const response = await client.query({
      query: gql`
        query($id: String!) {
          appToken(id: $id) {
            id
            name
            description
            email
            url
            icon
            redirectUrl
            webhook
            appKey
            appSecret
            refreshToken
          }
        }
      `,
      variables: {
        id: this.lifecycle.resourceId
      }
    })

    this.appToken = response.data.appToken
  }

  async updateAppToken(e) {
    e.preventDefault()

    const form = this.renderRoot.querySelector('form')
    const formData = new FormData(form)

    const patch = Array.from(formData.entries()).reduce((patch, [key, value]) => {
      patch[key] = value
      return patch
    }, {})

    const id = this.lifecycle.resourceId

    const response = await client.mutate({
      mutation: gql`
        mutation($id: String!, $patch: AppTokenPatch!) {
          updateAppToken(id: $id, patch: $patch) {
            id
            name
            description
            email
            url
            icon
            redirectUrl
            webhook
            appKey
            appSecret
            refreshToken
          }
        }
      `,
      variables: {
        id,
        patch
      }
    })

    if (response.errors) {
      console.error('update fail')
    } else {
      this.appToken = response.data.updateAppToken
      console.log('update sucess')
    }
  }

  async deleteAppToken(e) {
    const id = this.lifecycle.resourceId

    const response = await client.mutate({
      mutation: gql`
        mutation($id: String!) {
          deleteAppToken(id: $id)
        }
      `,
      variables: {
        id
      }
    })

    const result = response.data.deleteAppToken
    if (result) {
      console.log('delete sucess')
    } else {
      console.error('delete fail')
    }
  }
}

window.customElements.define('app-token-page', AppToken)

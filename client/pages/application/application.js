import { html, css, LitElement } from 'lit-element'
import gql from 'graphql-tag'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { client, store, PageView } from '@things-factory/shell'

class Application extends connect(store)(PageView) {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          overflow-y: auto;

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
        input:focus,
        button {
          outline: none;
        }
        fieldset {
          background-color: var(--theme-white-color);
          border-radius: var(--border-radius);
          border: var(--border-dark-color);
          margin: var(--fieldset-margin);
          padding: var(--fieldset-padding);
        }
        legend {
          padding: var(--legend-padding);
          font-weight: bold;
          color: var(--legend-color);
        }
        [field-2column] {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 15px;
        }
        [field] {
          display: flex;
          flex-direction: column;
          position: relative;
        }
        [grid-span] {
          grid-column: span 2;
        }
        button,
        [button-in-field] {
          background-color: var(--button-background-color);
          border: var(--button-border);
          border-radius: var(--button-border-radius);
          padding: var(--button-padding);
          color: var(--button-color);
          font: var(--button-font);
          text-transform: var(--button-text-transform);

          margin: var(--margin-default) 0 var(--margin-default) var(--margin-default);
          float: right;
          text-decoration: none;
        }
        button:hover {
          border: var(--button-activ-border);
          box-shadow: var(--button-active-box-shadow);
        }
        [button-in-field] {
          border-radius: 0 var(--button-border-radius) var(--button-border-radius) 0;
          position: absolute;
          top: 11px;
          right: 0;
          max-height: 36px;
        }
        [input-hint] {
          font: var(--input-hint-font);
          color: var(--input-hint-color);
        }
        @media screen and (max-width: 480px) {
          [field] {
            grid-column: span 2;
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
    var app = this.application || {}
    return html`
      <div>
        <h2>Create Applications</h2>
        <p page-description>
          create Applications description
        </p>
        <a href="applications" button-primary>applications ..</a>
      </div>

      <form>
        <fieldset>
          <legend>Application - ${app.name}</legend>
          <div field-2column>
            <div field grid-span>
              <label for="name">app name</label>
              <input id="name" type="text" name="name" .value=${app.name} />
            </div>

            <div field grid-span>
              <label for="description">description</label>
              <input id="description" type="text" name="description" .value=${app.description} />
            </div>

            <div field>
              <label for="email">api contact email</label>
              <input id="email" type="text" name="email" .value=${app.email} />
            </div>

            <div field>
              <label for="url">app url</label>
              <input id="url" type="text" name="url" .value=${app.url} />
            </div>

            <div field>
              <label for="icon">icon</label>
              <input id="icon" type="text" name="icon" .value=${app.icon} />
            </div>

            <div field>
              <label for="redirect-url">redirectUrl</label>
              <input id="redirect-url" type="text" name="redirectUrl" .value=${app.redirectUrl} />
            </div>

            <div field>
              <label for="webhook">webhook</label>
              <input id="webhook" type="text" name="webhook" .value=${app.webhook} />
            </div>
        </fieldset>

        <fieldset>
          <legend>app credentials</legend>
          <div field-2column>
            <div field grid-span>
              <label for="app-key">appKey</label>
              <input id="app-key" type="text" name="appKey" .value=${app.appKey} disabled />
              <button button-in-field>copy</button>
            </div>

            <div field grid-span>
              <label for="app-secret">appSecret</label>
              <input id="app-secret" type="text" name="appSecret" .value=${app.appSecret} disabled />
              <button button-in-field>copy</button>
              <div input-hint>created 6 days ago</div>
            </div>

            <div field grid-span>
              <label for="refresh-token">refresh token</label>
              <input id="refresh-token" type="text" name="refreshToken" .value=${app.refreshToken} disabled />
              <button button-in-field>copy</button>
              <div input-hint>expires 1 hour</div>
            </div>
          </div>
        </fieldset>

        <button>generate new secret</button>
        <button>generate new refresh token</button>

        <button @click=${this.updateApplication.bind(this)}>update</button>
        <button @click=${this.deleteApplication.bind(this)}>delete this app</button>
      </form>
    `
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

  async pageUpdated(changes, lifecycle, before) {
    if (this.active) {
      /*
       * this page is activated
       */
      await this.fetchApplication()
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

    this.application = response.data.application
  }

  async updateApplication(e) {
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
        mutation($id: String!, $patch: ApplicationPatch!) {
          updateApplication(id: $id, patch: $patch) {
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
      this.application = response.data.updateApplication
      console.log('update sucess')
    }
  }

  async deleteApplication(e) {
    const id = this.lifecycle.resourceId

    const response = await client.mutate({
      mutation: gql`
        mutation($id: String!) {
          deleteApplication(id: $id)
        }
      `,
      variables: {
        id
      }
    })

    const result = response.data.deleteApplication
    if (result) {
      console.log('delete sucess')
    } else {
      console.error('delete fail')
    }
  }
}

window.customElements.define('application-page', Application)
